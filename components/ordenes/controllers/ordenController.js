const elementService = require('../services');
const carritoService = require('../../carritosApi/services');
const productoService = require('../../pruducts/services');
const dolarService = require('../../dolarAutomatico/services')
const pino = require('../../../utils/logger/pino');
const JWT = require("../../../utils/jwt/jwt");
const Nodemailer = require('../../../utils/nodemailer')

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

    async createElement(req, res, next){
        try {
            const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
            let payload = await JWT.decode(token);
            let carritoId = await carritoService.save(payload);
            let carrito = await carritoService.getSubElementsById(carritoId);
            let ordenId = await elementService.save(payload,carrito);
            let message = `Orden generada, ID: ${ordenId}`;
            let dolar = await dolarService.getPrecio();
            await Nodemailer.orden(payload,carrito,"",dolar.dolar);
            let borrarCarrito = await carritoService.deleteById(carritoId);
            // res.status(200).render('verProductos',{message: message,productos, carritoId});	
            res.status(200).json({message: message, carritoId, ordenId: ordenId});
        } catch (error) {
            pino.error(`Se produjo un error: ${error}`);
            res.status(400).json({message: "Se produjo un error"});
        }
    }

    async createElementUser(req, res, next){
        try {
            const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
            let payload = await JWT.decode(token);
            let usuario = req.body
            let carritoId = await carritoService.save(payload);
            let carrito = await carritoService.getSubElementsById(carritoId);
            let ordenId = await elementService.saveUser(payload,carrito,usuario);
            let message = `Orden generada, ID: ${ordenId}`;
            let dolar = await dolarService.getPrecio();
            await Nodemailer.orden(payload,carrito,usuario.descuento,dolar.dolar);
            let borrarCarrito = await carritoService.deleteById(carritoId);
            // res.status(200).render('verProductos',{message: message,productos, carritoId});	
            res.status(200).json({message: message, carritoId, ordenId: ordenId});
        } catch (error) {
            pino.error(`Se produjo un error: ${error}`);
            res.status(400).json({message: "Se produjo un error"});
        }
    }

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
        try {
            let id = req.params.id
            let response = await elementService.getById(id);
            res.status(200).json(response);
        } catch (error) {
            pino.error(`Se produjo un error: ${error}`);
            res.status(400).render('error');
        }
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