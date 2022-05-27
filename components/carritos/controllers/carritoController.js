const elementService = require('../services');
const productService = require('../../pruductos/services');
const pino = require('../../../utils/logger/pino');
const JWT = require("../../../utils/jwt/jwt");

class Element {

    async createElement(req, res, next){
        try {
            let element = req.body; // En el body recibe email y dirección
            // let response = await elementService.save(element);
            let response = await elementService.save(element);
            res.json(response);
        } catch (error) {
            pino.error(`Se produjo un error: ${error}`);
        }
    }

    async createSubElement(req, res, next){
        try {
            let id = req.params.id
            let subElement = req.body;
            let response = await elementService.saveSubElement(id,subElement);
            // res.json(response);

            const token = req.cookies.token
            let payload = await JWT.decode(token)
            // let carrito = await elementService.getByEmail(payload.email);
            let carritoId = await elementService.save(payload);
            let productos = await productService.getAll();
            res.render('verProductos',{message: 'Producto agregado',productos, carritoId});	
            // res.render('verCarrito',{message: '',carrito});
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

    async getSubElement(req, res, next){
        try {
            let id = req.params.id
            let response = await elementService.getSubElementsById(id);
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

    async deleteSubElement(req, res, next){
        try {
            let id_prod = req.params.id_prod;
            let id = req.params.id;
            let response = await elementService.deleteSubElementById(id, id_prod);
            // res.json(response);
            res.json({
                result:'ok',
                id: req.params.id_prod      
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