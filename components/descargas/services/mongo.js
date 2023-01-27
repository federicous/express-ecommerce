let UsuarioModel = require('../../../schema/usuarios');
let bcrypt = require("bcryptjs");
const JWT = require("../../../utils/jwt/jwt");
const pino = require('../../../utils/logger/pino');

class AuthService {

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
			return {id: agregarUsuario._id, ...usuario, message:''}

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
		}
	}

	async login(email, password) {
		try {
			let user = await UsuarioModel.findOne({
				email: email
			});
			pino.info(user);
			if (!user) {
				pino.error(`NO EXISTE EL USUARIO ${email}`);
				return ({
					message: 'No existe el usuario'
				})
			} else if (bcrypt.compareSync(password, user.password)) {
				let ID = user._id ? user._id : user.id;
				const token = await JWT.generate({
					id: ID,
					name: user.name,
					email: user.email,
					isAdmin: user.isAdmin,
					vendedor: user.vendedor,
				})
				return ({
					email: user.email,
					token
				})
			} else {
				pino.error(`CONTRASEÑA INCORRECTA: ${password} PARA USUARIO: ${email}`);
				return ({
					message: 'contraseña incorrecta'
				})
			}
		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
		}
	}

}

module.exports = AuthService;