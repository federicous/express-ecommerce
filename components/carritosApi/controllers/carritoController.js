const elementService = require('../services');
const productService = require('../../pruductos/services');
const pino = require('../../../utils/logger/pino');
const JWT = require("../../../utils/jwt/jwt");

class Element {

    async createElement(req, res, next){
        try {
            let element = req.body; // En el body recibe email y dirección
            const token = req.cookies.token;
            let payload = await JWT.decode(token);
            let carritoId = await elementService.save(payload);
              res.status(200).json(carritoId);
        } catch (error) {
            pino.error(`Se produjo un error cart: ${error}`)
            res.status(400).render('error');
        }
    }

    async createSubElement(req, res, next){
        try {
            const token = req.cookies.token;
            let payload = await JWT.decode(token);
            let carritoId = await elementService.save(payload);
            let subElement = req.body;
            // let response = await elementService.saveSubElement(carritoId,subElement);
            let response = await elementService.saveSubElementReact(carritoId,subElement);
            req.session.agregado = true;
            res.status(200).redirect('/productos')
            
        } catch (error) {
            pino.error(`Se produjo un error cart: ${error}`);
            res.status(400).render('error');
        }
    }

    async getProducts(req, res, next){
        try {
            const token = req.cookies.token
            let payload = await JWT.decode(token)
            let carritoId = await elementService.save(payload);
            let productos = await productService.getAll();
            let message = '';
            if (req.session.agregado) {
                message = 'Producto agregado al carrito'
            }
            req.session.agregado = false;
            // res.status(200).render('verProductos',{message: message,productos, carritoId});	
            res.status(200).render('categorias',{message: message,productos, carritoId});	


        } catch (error) {
            pino.error(`Se produjo un error cart: ${error}`);
            res.status(400).render('error');
        }
    }

    async getSubProducts(req, res, next){
        try {
            let id_prod = req.params.id_prod;
            const token = req.cookies.token
            let payload = await JWT.decode(token)
            let carritoId = await elementService.save(payload);
            let item = await productService.getById(id_prod);
            let message = '';
            if (req.session.agregado) {
                message = 'Producto actualizado'
            }
            req.session.agregado = false;
            res.status(200).render('item',{message: message,item, carritoId});	

        } catch (error) {
            pino.error(`Se produjo un error cart: ${error}`);
            res.status(400).render('error');
        }
    }

    async getElement(req, res, next){
        try {
            const token = req.cookies.token;
            let payload = await JWT.decode(token);
            let carritoId = await elementService.save(payload);
            let response = await elementService.getById(carritoId);
            res.status(200).json(response);
        } catch (error) {
            pino.error(`Se produjo un error cart: ${error}`);
            res.status(400).render('error');
        }
    }

    async getSubElement(req, res, next){
        try {
            const token = req.cookies.token;
            let payload = await JWT.decode(token);
            let carritoId = await elementService.save(payload);
            let carrito = await elementService.getSubElementsById(carritoId);
            res.status(200).json(carrito);	
        } catch (error) {
            pino.error(`Se produjo un error cart: ${error}`);
            res.status(400).render('error');
        }
    }

    async getAllElement(req, res, next){
        try {
            let response = await elementService.getAll();
            res.status(200).json(response);
        } catch (error) {
            pino.error(`Se produjo un error cart: ${error}`);
            res.status(400).render('error');
        }
    }



    async updateElement(req, res, next){
        try {
            let { element } = req.body;
            const token = req.cookies.token;
            let payload = await JWT.decode(token);
            let carritoId = await elementService.save(payload);
            let response = await elementService.modify(carritoId, element);
            res.status(200).json({
                result:'ok',
                id: carritoId,
                new: req.body
            })
        } catch (error) {
            pino.error(`Se produjo un error cart: ${error}`);
        }
    }

    async deleteElement(req, res, next){
        try {

            const token = req.cookies.token;
            let payload = await JWT.decode(token);
            let carritoId = await elementService.save(payload);
            let response = await elementService.deleteById(carritoId);
            carritoId = await elementService.save(payload);
            let carrito = await elementService.getSubElementsById(carritoId);
            res.status(200).render('carrito',{message: '',carrito, carritoId});	
        } catch (error) {
            pino.error(`Se produjo un error cart: ${error}`);
        }
    }

    async deleteSubElement(req, res, next){
        try {
            const token = req.cookies.token;
            let payload = await JWT.decode(token);
            let carritoId = await elementService.save(payload);
            let id_prod = req.params.id_prod;
            let response = await elementService.deleteSubElementById(carritoId, id_prod);
            let carrito = await elementService.getSubElementsById(carritoId);
            res.status(200).render('carrito',{message: 'Producto eliminado',carrito, carritoId});	

        } catch (error) {
            pino.error(`Se produjo un error cart: ${error}`);
        }
    }

    async deleteAllElement(req, res, next){
        try {
            let response = await elementService.deleteAll();
            res.status(200).json(response);
        } catch (error) {
            pino.error(`Se produjo un error cart: ${error}`);
        }
    }

    async getChat(req, res, next){
        try {
            const token = req.cookies.token;
            let payload = await JWT.decode(token);
            res.status(200).render('mensajes',{message: '',payload});	
        } catch (error) {
            pino.error(`Se produjo un error cart: ${error}`);
        }
    }
}


module.exports = new Element();