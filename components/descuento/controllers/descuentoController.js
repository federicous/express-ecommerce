const elementService = require('../services')
// const jwt = require("jsonwebtoken")
const JWT = require("../../../utils/jwt/jwt");
const pino = require('../../../utils/logger/pino');

class Element {

    async getDescuento(req, res, next){
        try {
            const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
            let email = req.query.email;
            let payload = await JWT.decode(token);
            let userDescuento = await elementService.getPorcentaje(payload,email);
            res.status(200).json(userDescuento)
        } catch (error) {
            pino.error(`Se produjo un error: ${error}`);
            res.status(400).render('error');
        }
    }

}

module.exports = new Element();