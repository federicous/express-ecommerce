let {connection, mongoose} = require("../../../config/mongo");
let UsuarioModel = require('../../../schema/usuarios');
let bcrypt = require("bcryptjs");
const pino = require('../../../utils/logger/pino')

class MongoDB {

	async save(usuario) {
		try {
			const passwordHash = bcrypt.hashSync(usuario.password, 10)
			usuario.password = passwordHash;
			usuario.timestamp=Date.now();
			let agregarUsuarioModel= new UsuarioModel(usuario);
			let agregarUsuario = await agregarUsuarioModel.save();
			pino.info(agregarUsuario);		
			
		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}
	}
	async modify(usuario,id) {
		try {
			let modificar = await UsuarioModel.findByIdAndUpdate(id, usuario);
			return(modificar)

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}	
	}

	async getById(id) {
		try {
			let mostrar = await UsuarioModel.findById(id);
			return(mostrar)
		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}	
	}

	async getAll() {
		try {
			let allUsers = await UsuarioModel.find({});
			return(allUsers)
			
		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}	
	}

	async deleteById(id) {
		try {
			let borrar = await UsuarioModel.findByIdAndDelete(id);

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}		
	}

	async deleteAll() {
		try {
			const contenido = await UsuarioModel.deleteMany({});

		} catch (error) {
			throw new Error(error)
		}
	}
}

module.exports= MongoDB;















