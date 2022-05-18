const JWT = require("../utils/jwt/jwt")

class Autenticacion {
	async usuario(req, res, next) {
		try {
			const token = req.cookies.token
			const payload = await JWT.verify(token)
			if (!payload) return res.status(401).render('authError')
			next()
		} catch (error) {
			console.log(error);
		}
	}

	async administrador(req, res, next) {
		try {
			const token = req.cookies.token
			const verification = await JWT.verify(token)
			console.log(verification);
			if(!verification) throw new Error('Token invalido')
			const payload = await JWT.decode(token)
			console.log(payload);
			if (!payload || payload.isAdmin != 'on'){
				console.log(payload.isAdmin);
				return res.status(401).render('authError')
			}
			if (!payload) return res.status(401).render('authError')
			console.log(`>>>>>> paso el midlleware`);
			next()
		} catch (error) {
			console.log(error);
		}

	}
}
module.exports = new Autenticacion;