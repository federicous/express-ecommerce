let {connection, mongoose} = require("../../../config/mongo");
let UsuarioModel = require('../../../schema/usuarios');
let bcrypt = require("bcryptjs");
const pino = require('../../../utils/logger/pino')

class MongoDB {

	async createUser(usuario,avatar) {
		try {
			let user = await UsuarioModel.findOne({email: usuario.email});
			if (user) {
				return ({message: 'Ya existe una cuenta con el mismo email'})
			}
			const passwordHash = bcrypt.hashSync(usuario.password, 10)
			usuario.password = passwordHash;
			usuario.timestamp = Date.now();
			usuario.avatar= avatar;
			let agregarUsuarioModel = new UsuarioModel(usuario);
			let agregarUsuario = await agregarUsuarioModel.save();
			pino.info(agregarUsuario);
			// return {id: agregarUsuario._id, email:usuario.email, message:''}
			return {id: agregarUsuario._id, ...usuario, message:'Usuario registrado'}

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
		}
	}

	async modifyUser(usuario,avatar) {
		try {
			// console.log(usuario);
			
			// let user = await UsuarioModel.findOne({_id: usuario._id});
			// if (user) {
			// 	return ({message: 'Ya existe una cuenta con el mismo email'})
			// }
			if (usuario.password) {
				const passwordHash = bcrypt.hashSync(usuario.password, 10)
				usuario.password = passwordHash;
			}
			// usuario.timestamp = Date.now();
			// usuario.avatar= avatar;
			// let agregarUsuarioModel = new UsuarioModel(usuario);
			// let agregarUsuario = await agregarUsuarioModel.save();
			await UsuarioModel.findOneAndUpdate({_id: `${usuario._id}`}, usuario)
			return{message:`ya se modificó el usuario ${usuario.email}`}
			// pino.info(agregarUsuario);
			// return {id: agregarUsuario._id, email:usuario.email, message:''}
			// return {id: agregarUsuario._id, ...usuario, message:''}

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
		}
	}

	async deleteUser(usuario,avatar) {
		try {
			// console.log(usuario);
			
			// let user = await UsuarioModel.findOne({_id: usuario._id});
			// if (user) {
			// 	return ({message: 'Ya existe una cuenta con el mismo email'})
			// }
			if (usuario.password) {
				const passwordHash = bcrypt.hashSync(usuario.password, 10)
				usuario.password = passwordHash;
			}
			// usuario.timestamp = Date.now();
			// usuario.avatar= avatar;
			// let agregarUsuarioModel = new UsuarioModel(usuario);
			// let agregarUsuario = await agregarUsuarioModel.save();
			await UsuarioModel.deleteOne({_id: `${usuario._id}`})
			pino.info(usuario)
			return{message:`se ELIMINÓ el usuario ${usuario.email}`}
			// pino.info(agregarUsuario);
			// return {id: agregarUsuario._id, email:usuario.email, message:''}
			// return {id: agregarUsuario._id, ...usuario, message:''}

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
		}
	}

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















