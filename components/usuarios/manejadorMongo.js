let {connection, mongoose} = require("../config/mongo");
let UsuarioModel = require('../schema/usuarios')

class MongoDB {


	async save(usuario) {
		try {
			usuario.timestamp=Date.now();
			let agregarUsuarioModel= new UsuarioModel(usuario);
			let agregarUsuario = await agregarUsuarioModel.save();
			console.log(agregarUsuario);		
			
		} catch (error) {
			console.log(`Error de lectura`, error);
			throw new Error(error)
		}
	}
	async modify(usuario,id) {
		try {
			// let modificar = await UsuarioModel.updateOne({_id:id}, {
			// 	$set: usuario
			// });
			let modificar = await UsuarioModel.findByIdAndUpdate(id, usuario);
			return(modificar)


		} catch (error) {
			console.log(`Error de lectura`, error);
			throw new Error(error)
		}	
	}

	async getById(id) {
		try {
			let mostrar = await UsuarioModel.findById(id);
			return(mostrar)
		} catch (error) {
			console.log(`Error de lectura`, error);
			throw new Error(error)
		}	
	}

	async getAll() {
		try {
			let allProducts = await UsuarioModel.find({});
			// console.log(allProducts);
			return(allProducts)
			
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















