// const apiAuth = require("../components/auth");

function autenticado(req, res, next) {
	const token = req.cookies.token
	const payload = await verifyToken(token)
	if (!payload) return res.status(401).render('error-auth')
	next()
}

function verifyToken(token){
        try {
            const verification = await JWT.verify(token)
            if(!verification) throw new Error('Token invalido')
            const payload = await JWT.decode(token)
            const user = await UserService.findById(payload.id)
            if(!user) throw new Error('El token no pertenece a ningun usuario')
            return payload
        } catch (error) {
            pino.error(`Tuvimos el siguiente error: ${error}`)
        }
    }



module.exports = autenticado();