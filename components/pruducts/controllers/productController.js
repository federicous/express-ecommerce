const elementService = require('../services');
const pino = require('../../../utils/logger/pino');
const carritoService = require('../../carritos/services');
const JWT = require("../../../utils/jwt/jwt");

class Element {

    async createElement(req, res, next){
        try {
            let element = req.body;
            let imageName= req.imageName;
            let response = await elementService.save(element, imageName);
            res.status(200).json(response);
        } catch (error) {
            pino.error(`Se produjo un error: ${error}`);
            res.status(400).render('error');
        }
    }

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
             // let response = await elementService.getAll();
             let page = req.query.page;
             let pageSize = req.query.pageSize
             let response = await elementService.getAllPage(page,pageSize);
            res.status(200).json(response);

        } catch (error) {
            pino.error(`Se produjo un error: ${error}`);
            res.status(400).render('error');
        }
    }

    async getAllElementCategory(req, res, next){
        try {
            let page = req.query.page;
            let pageSize = req.query.pageSize
            let category = req.params.category
            let response = await elementService.getAllCategoryPage(category,page,pageSize);
            res.status(200).json(response);

        } catch (error) {
            pino.error(`Se produjo un error: ${error}`);
            res.status(400).render('error');
        }
    }

    async getAllElementCategoryLista(req, res, next){
        try {
            let page = req.query.page;
            let pageSize = req.query.pageSize
            let category = req.params.category
            let lista = req.params.lista
            let response = await elementService.getAllCategoryPageLista(category,page,pageSize,lista);
            res.status(200).json(response);

        } catch (error) {
            pino.error(`Se produjo un error: ${error}`);
            res.status(400).render('error');
        }
    }

    async getAllElementLista(req, res, next){
        try {
            let page = req.query.page;
            let pageSize = req.query.pageSize
            let category = req.params.category
            let lista = req.params.lista
            let response = await elementService.getAllPageLista(category,page,pageSize,lista);
            res.status(200).json(response);

        } catch (error) {
            pino.error(`Se produjo un error: ${error}`);
            res.status(400).render('error');
        }
    }

    async updateElement(req, res, next){
        try {
            let element = req.body;
            let id = req.params.id
            let imageName= req.imageName;
            let response = await elementService.modifyAll(id, element, imageName);
            res.status(200).json({
                result:'ok',
                id: req.params.id,
                new: req.body,
                response: response.message,
            })
        } catch (error) {
            pino.error(`Se produjo un error: ${error}`);
            res.status(400).render('error');
        }
    }

    async updateAllElement(req, res, next){
        try {
            let element = req.body;
            let imageName= req.imageName;
            let response = await elementService.modifyAll(element, imageName);
            res.status(200).json({
                result:'ok',
                new: req.body,
                response: response.resultado,
            })
        } catch (error) {
            pino.error(`Se produjo un error: ${error}`);
            res.status(400).render('error');
        }
    }

    async updateAllElementCode(req, res, next){
        try {
            let element = req.body;
            let imageName= req.imageName;
            let response = await elementService.modifyAllCode(element, imageName);
            res.status(200).json({
                result:'ok',
                new: req.body,
                response: response.resultado,
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