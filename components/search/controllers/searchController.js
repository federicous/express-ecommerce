const elementService = require('../services');
const pino = require('../../../utils/logger/pino');
const carritoService = require('../../carritos/services');
const JWT = require("../../../utils/jwt/jwt");

class Element {

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

    async getAllElementCategory(req, res, next){
        try {
            let category = req.params.category
            let response = await elementService.getAllCategory(category);
            res.status(200).json(response);

        } catch (error) {
            pino.error(`Se produjo un error: ${error}`);
            res.status(400).render('error');
        }
    }

    async getAllNames(req, res, next){
        try {
            let patron = req.params.patron
            let response = await elementService.getAllNames(patron);
            res.status(200).json(response);

        } catch (error) {
            pino.error(`Se produjo un error: ${error}`);
            res.status(400).render('error');
        }
    } 
}


module.exports = new Element();