const elementService = require('../services');
const carritoService = require('../../carritos/services');
const productoService = require('../../pruductos/services');
const pino = require('../../../utils/logger/pino');
const JWT = require("../../../utils/jwt/jwt");

class Element {


    async createElement(req, res, next){
        try {
            const token = req.cookies.token;
            let payload = await JWT.decode(token);
            let carritoId = await carritoService.save(payload);
            let carrito = await carritoService.getSubElementsById(carritoId);
            let ordenId = await elementService.save(payload,carrito);
            let borrarCarrito = await carritoService.deleteById(carritoId);
            let productos = await productoService.getAll();
            let message = `Orden generada, ID: ${ordenId}`;
            res.status(200).render('verProductos',{message: message,productos, carritoId});	
        } catch (error) {
            pino.error(`Se produjo un error: ${error}`);
        }
    }

    async getElement(req, res, next){
        try {
            let id = req.params.id
            let response = await elementService.getById(id);
            res.json(response);
        } catch (error) {
            pino.error(`Se produjo un error: ${error}`);
        }
    }

    async getAllElement(req, res, next){
        try {
            let response = await elementService.getAll();
            res.json(response);
        } catch (error) {
            pino.error(`Se produjo un error: ${error}`);
        }
    }

    async updateElement(req, res, next){
        try {
            let { element } = req.body;
            let id = req.params.id
            let response = await elementService.modify(id, element);
            res.json({
                result:'ok',
                id: req.params.id,
                new: req.body
            })
        } catch (error) {
            pino.error(`Se produjo un error: ${error}`);
        }
    }

    async deleteElement(req, res, next){
        try {
            // let { id } = req.body;
            let id = req.params.id
            let response = await elementService.deleteById(id);
            // res.json(response);
            res.json({
                result:'ok',
                id: req.params.id      
            })
        } catch (error) {
            pino.error(`Se produjo un error: ${error}`);
        }
    }

    async deleteAllElement(req, res, next){
        try {
            let response = await elementService.deleteAll();
            res.json(response);
        } catch (error) {
            pino.error(`Se produjo un error: ${error}`);
        }
    }
}


module.exports = new Element();