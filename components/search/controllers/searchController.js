const elementService = require('../services');
const pino = require('../../../utils/logger/pino');
const carritoService = require('../../carritos/services');
const JWT = require("../../../utils/jwt/jwt");

class Element {

    async getAllElement(req, res, next){
        try {
            let page = req.query.page;
            let pageSize = req.query.pageSize
            let response = await elementService.getAllPage(page,pageSize);
           res.status(200).json(response);

        } catch (error) {
            pino.error(`Se produjo un error: ${error}`);
            res.status(400).render('error');
        }
    }

    // async getAllNames(req, res, next){
    //     try {
    //         let patron = req.params.patron
    //         let response = await elementService.getAllNames(patron);
    //         res.status(200).json(response);

    //     } catch (error) {
    //         pino.error(`Se produjo un error: ${error}`);
    //         res.status(400).render('error');
    //     }
    // } 

    async getAllNames(req, res, next){
        try {
            let page = req.query.page;
            let pageSize = req.query.pageSize
            let patron = req.params.patron
            let response = await elementService.getAllNamesPage(patron,page,pageSize);
            res.status(200).json(response);

        } catch (error) {
            pino.error(`Se produjo un error: ${error}`);
            res.status(400).render('error');
        }
    } 
}


module.exports = new Element();