const JWT = require("../utils/jwt/jwt")
const pino = require('../utils/logger/pino')

class Autenticacion {
	async usuario(req, res, next) {
		try {
			const token = req.cookies.token
			const payload = await JWT.verify(token)
			if (!payload) return res.status(401).clearCookie("token").clearCookie("user").render('authError')
			next()
		} catch (error) {
			pino.error(`Se produjo un error: ${error}`);
		}
	}

	async administrador(req, res, next) {
		try {
			const token = req.cookies.token
			const verification = await JWT.verify(token)
			// console.log(verification);
			if(!verification) { 
				return res.status(401).clearCookie("token").clearCookie("user").render('authError')
			}
			const payload = await JWT.decode(token)
			if (!payload || payload.isAdmin != 'on'){
				return res.status(401).render('authError')
			}
			if (!payload) return res.status(401).render('authError')
			next()
		} catch (error) {
			pino.error(`Se produjo un error: ${error}`);
		}

	}
}
module.exports = new Autenticacion;