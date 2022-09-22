let UsuarioModel = require('../../../schema/usuarios');
const pino = require('../../../utils/logger/pino');

class ElementService {

	async getLevel(payload) {
		try {
			let user = await UsuarioModel.findOne({
				email: payload.email
			});
			pino.info(user);
			if (!user) {
				pino.error(`NO EXISTE EL USUARIO ${payload.email}`);
				return (false)
			} else {
				if (user.isAdmin=="on" || user.isAdmin==true) {
					return(true)
				} 
				return(false)
			}
		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
		}
	}

}

module.exports = ElementService;