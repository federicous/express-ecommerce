let UsuarioModel = require('../../../schema/usuarios');
const pino = require('../../../utils/logger/pino');

class ElementService {

	async getPorcentaje(payload,email) {
		try {
			let user = await UsuarioModel.findOne({
				email: email ? email : payload.email
			});
			// pino.info(user);
			if (!user) {
				pino.error(`NO EXISTE EL USUARIO ${email ? email : payload.email}`);
				return ("")
			} else {
				if (user.descuento) {
					return(user.descuento)
				} 
				return("")
			}
		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
		}
	}

}

module.exports = ElementService;