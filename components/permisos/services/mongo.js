let UsuarioModel = require('../../../schema/usuarios');
const pino = require('../../../utils/logger/pino');

class ElementService {

	async getLevel(payload) {
		try {
			let user = await UsuarioModel.findOne({
				email: payload.email
			});
			// pino.info(user);
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



	async getDesc(payload) {
		try {
			let user = await UsuarioModel.findOne({
				email: payload.email
			});
			// pino.info(user);
			if (!user) {
				pino.error(`NO EXISTE EL USUARIO ${payload.email}`);
				return ("")
			} else {
				return(user.descuento ? user.descuento : "") 
			}
		} catch (error) {
			pino.error(`Se produjo un error en getDesc: ${error}`)
		}
	}

	async getSell(payload) {
		try {
			let users = await UsuarioModel.find({
				isSeller: "on"
			},{email:1, IdVendedor:1,isSeller:1});
			// pino.info(users);
			return(users)
			// if (!user) {
			// 	pino.error(`NO EXISTE EL USUARIO ${payload.email}`);
			// 	return ("")
			// } else {
			// 	return(user.descuento ? user.descuento : "") 
			// }
		} catch (error) {
			pino.error(`Se produjo un error en getDesc: ${error}`)
		}
	}

}

module.exports = ElementService;