let {connection, mongoose} = require("../../../config/mongo");
let UsuarioModel = require('../../../schema/usuarios');
let bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const JWT = require("../../../utils/jwt/jwt")
require("dotenv").config();

class AuthService {

	async createUser(usuario) {
		try {
			const passwordHash = bcrypt.hashSync(usuario.password, 10)
			usuario.password = passwordHash;
			usuario.timestamp=Date.now();
			let agregarUsuarioModel= new UsuarioModel(usuario);
			let agregarUsuario = await agregarUsuarioModel.save();
			console.log(agregarUsuario);		
			return	agregarUsuario._id
		} catch (error) {
			console.log(`Error de lectura`, error);
			throw new Error(error)
		}
	}

	async login(email,password) {
		try {
			let secret = process.env.SECRET;
			console.log(secret);
			let user = await UsuarioModel.findOne({email: email});
			console.log(user);
			if (!user) {
				return (res.status(404).send({message:'No existe el usuario'}))
			} else if (bcrypt.compareSync(password, user.password)){
				// const token = jwt.sign({
				// 	userId: user._id,
				// 	isAdmin: user.isAdmin,
				// }, secret,{expiresIn: '1d'});
				const token = await JWT.generate({
					 	userId: user._id,
					 	isAdmin: user.isAdmin,
					})
				// return (res.status(200).send({email: user.email, token}))
				return({email: user.email, token})
			} else {
				// return (res.status(400).send({message:'contraseña incorrecta'}))
				return({message:'contraseña incorrecta'})
			}
			// return(user)
		} catch (error) {
			console.log(`Error de lectura`, error);
			throw new Error(error)
		}	
	}


}

module.exports= new AuthService;















