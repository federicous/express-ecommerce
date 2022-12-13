const elementService = require('../services')
// const jwt = require("jsonwebtoken")
const JWT = require("../../../utils/jwt/jwt");
const pino = require('../../../utils/logger/pino');

class Element {

    async getDolar(req, res, next){
        try {
            let dolar = await elementService.getPrecio();
            res.status(200).json(dolar)
        } catch (error) {
            pino.error(`Se produjo un error: ${error}`);
            res.status(400).render('error');
        }
    }

    async postDolar(req, res, next){
        try {
            let element = req.body;
            let dolar = await elementService.postPrecio(element);
            res.status(200).json(dolar)
        } catch (error) {
            pino.error(`Se produjo un error: ${error}`);
            res.status(400).render('error');
        }
    }
}

module.exports = new Element();