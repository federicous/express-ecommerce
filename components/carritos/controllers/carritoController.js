const elementService = require('../services');
const productService = require('../../pruductos/services');
const pino = require('../../../utils/logger/pino');
const JWT = require("../../../utils/jwt/jwt");

class Element {

    async createElement(req, res, next){
        try {
            let element = req.body; // En el body recibe email y dirección
            // let response = await elementService.save(element);
            const token = req.cookies.token;
            let payload = await JWT.decode(token);
            let carritoId = await elementService.save(payload);
              res.json(carritoId);
        } catch (error) {
            pino.error(`Se produjo un error: ${error}`);
        }
    }

    async createSubElement(req, res, next){
        try {
            const token = req.cookies.token;
            let payload = await JWT.decode(token);
            let carritoId = await elementService.save(payload);
            let subElement = req.body;
            let response = await elementService.saveSubElement(carritoId,subElement);
            // res.json(response);


            // let productos = await productService.getAll();
            // res.render('verProductos',{message: 'Producto agregado',productos, carritoId});	
            // res.send('agregado')
            req.session.agregado = true;
            res.status(200).redirect('/productos')
            
        } catch (error) {
            pino.error(`Se produjo un error: ${error}`);
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
            res.status(200).render('verProductos',{message: message,productos, carritoId});	

        } catch (error) {
            pino.error(`Se produjo un error: ${error}`);
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
            pino.error(`Se produjo un error: ${error}`);
        }
    }

    async getElement(req, res, next){
        try {
            const token = req.cookies.token;
            let payload = await JWT.decode(token);
            let carritoId = await elementService.save(payload);
            let response = await elementService.getById(carritoId);
            res.json(response);
        } catch (error) {
            pino.error(`Se produjo un error: ${error}`);
        }
    }

    async getSubElement(req, res, next){
        try {
            const token = req.cookies.token;
            let payload = await JWT.decode(token);
            let carritoId = await elementService.save(payload);
            let carrito = await elementService.getSubElementsById(carritoId);
            res.status(200).render('carrito',{message: '',carrito, carritoId});	
            // res.json(response);
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
            const token = req.cookies.token;
            let payload = await JWT.decode(token);
            let carritoId = await elementService.save(payload);
            let response = await elementService.modify(carritoId, element);
            res.json({
                result:'ok',
                id: carritoId,
                new: req.body
            })
        } catch (error) {
            pino.error(`Se produjo un error: ${error}`);
        }
    }

    async deleteElement(req, res, next){
        try {

            const token = req.cookies.token;
            let payload = await JWT.decode(token);
            let carritoId = await elementService.save(payload);
            let response = await elementService.deleteById(carritoId);
            let carrito = await elementService.getSubElementsById(carritoId);
            res.status(200).render('carrito',{message: '',carrito, carritoId});	
            // // res.json(response);
            // res.json({
            //     result:'ok',
            //     id: carritoId      
            // })
        } catch (error) {
            pino.error(`Se produjo un error: ${error}`);
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

            // // res.json(response);
            // res.json({
            //     result:'ok',
            //     id: req.params.id_prod      
            // })
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