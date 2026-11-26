const elementService = require('../services');
const carritoService = require('../../carritosApi/services');
const descuentoService = require('../../descuento/services');
const usuarioService = require('../../usuarios/services');
const dolarService = require('../../dolarAutomatico/services')
const pino = require('../../../utils/logger/pino');
const JWT = require("../../../utils/jwt/jwt");
const Nodemailer = require('../../../utils/nodemailer')

const mongoose = require('mongoose');
const { checkout } = require('../../../utils/order-notifications/checkout');
const { createAdminOrderDetailHandler } = require('../../../utils/order-notifications/admin-order-detail');
const OrderModel = require('../../../schema/ordenes');
const CartModel = require('../../../schema/carritos');
const { v4: uuid } = require('uuid');

const adminOrderDetailHandler = createAdminOrderDetailHandler(
    OrderModel,
    id => typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id) && mongoose.isValidObjectId(id)
);

async function createOrder(req, res, onBehalf) {
    try {
        if (process.env.ORDER_OUTBOX_ENABLED !== 'true') return res.status(503).json({message:'Pedidos temporalmente no disponibles. Intentá más tarde.', code:'OUTBOX_DISABLED'});
        const actor = req.user || await JWT.verify(req.cookies?.token || req.headers.authorization?.split(' ')[1]);
        if (!actor || !actor.email) throw new Error('Verified user missing');
        if (!req.get('Idempotency-Key')) return res.status(426).json({message:'Actualizá la aplicación antes de crear un pedido', code:'UPDATE_REQUIRED'});
        const target = onBehalf ? req.body : actor;
        const budget = onBehalf && req.query.presupuesto === 'si';
        const indexes = await OrderModel.collection.indexes();
        if (!indexes.some(i => i.key && i.key.idempotencyKey === 1 && i.unique === true && i.sparse === true)) {
            throw new Error('Unique idempotency index is not ready');
        }
        const outcome = await checkout({
            actor, key: req.get('Idempotency-Key'), target, budget,
            getCart: async () => {
                const cart = await CartModel.findOne({email: actor.email}).lean();
                if (!cart) throw new Error('Cart not found');
                return cart.productList;
            },
            makeMail: async cart => {
                const dolar = await dolarService.getPrecio();
                const descuento = onBehalf ? target.descuento : await descuentoService.getPorcentaje(actor);
                const seller = await usuarioService.getByIdVendedor(target.vendedor);
                return Nodemailer.crearOrden(actor, cart, descuento, dolar.dolar, seller, onBehalf ? target.email : undefined, budget ? 'si' : '');
            },
            findExisting: key => OrderModel.findOne({idempotencyKey:key}).select('+notification').lean(),
            insert: async ({cart, notification, scopedKey, fingerprint}) => {
                return OrderModel.create({id:uuid(), timestamp:Date.now(), email:target.email, state:target.state, productList:cart, presupuesto:budget ? 'si' : '', notification, idempotencyKey:scopedKey, requestFingerprint:fingerprint});
            },
            clearCart: async cart => {
                const result = await CartModel.deleteOne({email:actor.email, productList:cart});
                if (!result.deletedCount && result.n !== 1) throw new Error('Cart changed during checkout');
            }
        });
        return res.status(200).json({ordenId:outcome.order._id, notificationStatus:outcome.order.notification.status, replayed:outcome.replayed, cleanupPending:outcome.replayed === true || outcome.cleanupPending === true});
    } catch(error) {
        pino.error(`Error al registrar pedido: ${error}`);
        return res.status(400).json({message:'No se pudo confirmar el pedido. Revisá el historial antes de reintentar.'});
    }
}

class Element {

    // async createElement(req, res, next){
    //     try {
    //         const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    //         let payload = await JWT.decode(token);
    //         let carritoId = await carritoService.save(payload);
    //         let carrito = await carritoService.getSubElementsById(carritoId);
    //         let ordenId = await elementService.save(payload,carrito);
    //         let productos = await productoService.getAll();
    //         let message = `Orden generada, ID: ${ordenId}`;
    //         await Nodemailer.orden(payload,carrito);
    //         let borrarCarrito = await carritoService.deleteById(carritoId);
    //         res.status(200).render('verProductos',{message: message,productos, carritoId});	
    //     } catch (error) {
    //         pino.error(`Se produjo un error: ${error}`);
    //         res.status(400).render('error');
    //     }
    // }

    async pendingNotifications(req, res) {
        try {
            const before = req.query.before;
            if (before && !/^[0-9a-fA-F]{24}$/.test(before)) return res.status(400).json({message:'Cursor inválido'});
            const query = {'notification.status':{$in:['pending','review']}};
            if (before) query._id = {$lt: before};
            const docs = await OrderModel.find(query)
                .select('_id timestamp email +notification').sort({_id:-1}).limit(100).lean();
            return res.json(docs.map(o=>({ordenId:o._id, timestamp:o.timestamp, email:o.email,
                status:o.notification.status, attempts:o.notification.attempts,
                nextAttemptAt:o.notification.nextAttemptAt})));
        } catch (_) { return res.status(500).json({message:'No se pudo consultar la cola'}); }
    }
    async notificationStatus(req, res) {
        try {
            const order = await OrderModel.findById(req.params.id).select('+notification').lean();
            if (!order || !order.notification) return res.status(404).json({message:'Sin notificación registrada'});
            const n = order.notification;
            return res.json({status:n.status, attempts:n.attempts, nextAttemptAt:n.nextAttemptAt, lastError:n.lastError, recipients:n.recipients});
        } catch (_) { return res.status(400).json({message:'No se pudo consultar la notificación'}); }
    }
    async retryNotification(req, res) {
        try {
            if (req.body.acknowledgeDuplicateRisk !== true) return res.status(400).json({message:'Se requiere confirmar el riesgo de duplicación'});
            const order = await OrderModel.findById(req.params.id).select('+notification').lean();
            if (!order || !order.notification || order.notification.status !== 'review') return res.status(409).json({message:'Notificación no disponible para reintento'});
            const recipients = order.notification.recipients.map(r => ({...r, status:r.status === 'accepted' ? 'accepted' : 'pending'}));
            if (!recipients.some(r => r.status === 'pending')) return res.status(409).json({message:'No hay destinatarios pendientes'});
            const operator = req.user || await JWT.verify(req.cookies?.token || req.headers.authorization?.split(' ')[1]);
            if (!operator) throw new Error('Verified administrator missing');
            const result = await OrderModel.updateOne({_id:order._id, 'notification.status':'review', 'notification.attempts':order.notification.attempts}, {$set:{'notification.status':'pending', 'notification.nextAttemptAt':new Date(), 'notification.recipients':recipients, 'notification.attempts':0}});
            if (!(result.modifiedCount || result.nModified)) return res.status(409).json({message:'La notificación cambió; actualice y vuelva a revisar'});
            pino.info(`Reintento manual para orden ${order._id}; operador ${operator.email || 'sin email'}`);
            return res.json({status:'pending'});
        } catch (_) { return res.status(400).json({message:'No se pudo programar el reintento'}); }
    }

    async createElement(req, res) { return createOrder(req, res, false); }
    async createElementUser(req, res) { return createOrder(req, res, true); }

    // async createElementReact(req, res, next){
    //     try {
    //         const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    //         let payload = await JWT.decode(token);
    //         let carrito = req.body
    //         let ordenId = await elementService.save(payload,carrito);
    //         let productos = await productoService.getAll();
    //         let message = `Orden generada, ID: ${ordenId}`;
    //         await Nodemailer.orden(payload,carrito);
    //         let borrarCarrito = await carritoService.deleteById(carritoId);
    //         res.status(200).render('verProductos',{message: message,productos, carritoId});	
    //     } catch (error) {
    //         pino.error(`Se produjo un error: ${error}`);
    //         res.status(400).render('error');
    //     }
    // }  

    async getElement(req, res, next){
        return adminOrderDetailHandler(req, res, next);
    }

    async getAllElement(req, res, next){
        try {
            let response = await elementService.getAll();
            res.status(200).json(response);
        } catch (error) {
            pino.error(`Se produjo un error: ${error}`);
            res.status(400).render('error');
        }
    }

    async getAllElementUser(req, res, next){
        try {
            const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
            let payload = await JWT.decode(token);
            let response = await elementService.getAllUser(payload);
            res.status(200).json(response);
        } catch (error) {
            pino.error(`Se produjo un error: ${error}`);
            res.status(400).render('error');
        }
    }

    async updateElement(req, res, next){
        try {
            let { element } = req.body;
            let id = req.params.id
            let response = await elementService.modify(id, element);
            res.status(200).json({
                result:'ok',
                id: req.params.id,
                new: req.body
            })
        } catch (error) {
            pino.error(`Se produjo un error: ${error}`);
            res.status(400).render('error');
        }
    }

    async deleteElement(req, res, next){
        try {
            let id = req.params.id
            let response = await elementService.deleteById(id);
            res.status(200).json({
                result:'ok',
                id: req.params.id      
            })
        } catch (error) {
            pino.error(`Se produjo un error: ${error}`);
            res.status(400).render('error');
        }
    }

    async deleteAllElement(req, res, next){
        try {
            let response = await elementService.deleteAll();
            res.status(200).json(response);
        } catch (error) {
            pino.error(`Se produjo un error: ${error}`);
            res.status(400).render('error');
        }
    }
}


module.exports = new Element();