const elementService = require('../services')
// const jwt = require("jsonwebtoken")
const JWT = require("../../../utils/jwt/jwt");
const pino = require('../../../utils/logger/pino');

class Element {

    async getPermiso(req, res, next){
        try {
            const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
            if (!token) return res.status(200).json(false);
            let payload = await JWT.decode(token);
            if (!payload) return res.status(200).json(false);
            let userLevel = await elementService.getLevel(payload);
            res.status(200).json(userLevel || false);
        } catch (error) {
            res.status(200).json(false);
        }
    }

    async getDescuento(req, res, next){
        try {
            const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
            let payload = await JWT.decode(token);
            let userLevel = await elementService.getDesc(payload);
            res.status(200).json(userLevel)
        } catch (error) {
            pino.error(`Se produjo un error: ${error}`);
            res.status(400).render('error');
        }
    }

    async getVende(req, res, next){
        try {
            const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
            let payload = await JWT.decode(token);
            let userLevel = await elementService.getSell(payload);
            res.status(200).json(userLevel)
        } catch (error) {
            pino.error(`Se produjo un error: ${error}`);
            res.status(400).render('error');
        }
    }

}

module.exports = new Element();