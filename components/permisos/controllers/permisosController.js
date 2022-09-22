const elementService = require('../services')
// const jwt = require("jsonwebtoken")
const JWT = require("../../../utils/jwt/jwt");
const pino = require('../../../utils/logger/pino');

class Element {

    async getPermiso(req, res, next){
        try {
            const token = req.cookies.token;
            let payload = await JWT.decode(token);
            let userLevel = await elementService.getLevel(payload);
            res.status(200).json(userLevel)
        } catch (error) {
            pino.error(`Se produjo un error: ${error}`);
            res.status(400).render('error');
        }
    }

}

module.exports = new Element();