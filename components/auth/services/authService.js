let UsuarioModel = require('../../../schema/usuarios');
let bcrypt = require("bcryptjs");
const JWT = require("../../../utils/jwt/jwt")
require("dotenv").config();

class AuthService {

	async createUser(usuario) {
		try {
			let user = await UsuarioModel.findOne({email: usuario.email});
			console.log(usuario);
			console.log(user);
			if (user.email) {
				return ({message: 'Ya existe una cuenta con el mismo email'})
			}
			const passwordHash = bcrypt.hashSync(usuario.password, 10)
			usuario.password = passwordHash;
			usuario.timestamp = Date.now();
			let agregarUsuarioModel = new UsuarioModel(usuario);
			let agregarUsuario = await agregarUsuarioModel.save();
			console.log(agregarUsuario);
			return agregarUsuario._id

		} catch (error) {
			console.log(`Error de lectura`, error);
			throw new Error(error)
		}
	}

	async login(email, password) {
		try {
			let secret = process.env.SECRET;
			console.log(secret);
			let user = await UsuarioModel.findOne({
				email: email
			});
			console.log(user);
			if (!user) {
				console.log(`NO EXISTEEEEE`);
				return ({
					message: 'No existe el usuario'
				})
			} else if (bcrypt.compareSync(password, user.password)) {
				const token = await JWT.generate({
					userId: user._id,
					isAdmin: user.isAdmin,
				})
				return ({
					email: user.email,
					token
				})
			} else {
				return ({
					message: 'contraseña incorrecta'
				})
			}
		} catch (error) {
			console.log(`Error de lectura`, error);
			throw new Error(error)
		}
	}

}

module.exports = new AuthService;