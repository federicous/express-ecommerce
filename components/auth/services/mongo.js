let {connection, mongoose} = require("../../../config/mongo");
let UsuarioModel = require('../../../schema/usuarios');
let bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
require("dotenv").config();

class MongoDB {

	async save(usuario) {
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
	async modify(usuario,id) {
		try {
			let modificar = await UsuarioModel.findByIdAndUpdate(id, usuario);
			return(modificar)

		} catch (error) {
			console.log(`Error de lectura`, error);
			throw new Error(error)
		}	
	}

	async getById(id) {
		try {
			let user = await UsuarioModel.findById(id);
			return(user)
		// console.log(allUsers);
			return(allUsers)
			
		} catch (error) {
			console.log(`Error de lectura`, error);
			throw new Error(error)
		}	
	}

	async getByEmail(email,password) {
		try {
			let secret = process.env.SECRET;
			console.log(secret);
			let user = await UsuarioModel.findOne({email: email});
			console.log(user);
			if (!user) {
				return (res.status(404).send({message:'No existe el usuario'}))
			} else if (bcrypt.compareSync(password, user.password)){
				const token = jwt.sign({
					userId: user._id,
					idAdmin: user.isAdmin,
				}, secret,{expiresIn: '1d'});
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

	async deleteById(id) {
		try {
			// let borrar = await UsuarioModel.deleteOne({"_id": id});
			let borrar = await UsuarioModel.findByIdAndDelete(id);

		} catch (error) {
			console.log(`Error de lectura`, error);
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















