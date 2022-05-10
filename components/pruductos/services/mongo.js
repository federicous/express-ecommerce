// let {connection, mongoose} = require("../config/mongo");
let {connection, mongoose} = require("../../../config/mongo");
// let ProductoModel = require('../schema/productos')
let ProductoModel = require('../../../schema/productos')

class MongoDB {


	async save(producto) {
		try {
			producto.timestamp=Date.now();
			let agregarProductoModel= new ProductoModel(producto);
			let agregarProducto = await agregarProductoModel.save();
			console.log(agregarProducto);		
			
		} catch (error) {
			console.log(`Error de lectura`, error);
			throw new Error(error)
		}
	}
	async modify(producto,id) {
		try {
			// let modificar = await ProductoModel.updateOne({_id:id}, {
			// 	$set: producto
			// });
			let modificar = await ProductoModel.findByIdAndUpdate(id, producto);
			return(modificar)


		} catch (error) {
			console.log(`Error de lectura`, error);
			throw new Error(error)
		}	
	}

	async getById(id) {
		try {
			let mostrar = await ProductoModel.findById(id);
			return(mostrar)
		} catch (error) {
			console.log(`Error de lectura`, error);
			throw new Error(error)
		}	
	}

	async getAll() {
		try {
			let allProducts = await ProductoModel.find({});
			// console.log(allProducts);
			return(allProducts)
			
		} catch (error) {
			console.log(`Error de lectura`, error);
			throw new Error(error)
		}	
	}

	async deleteById(id) {
		try {
			// let borrar = await ProductoModel.deleteOne({"_id": id});
			let borrar = await ProductoModel.findByIdAndDelete(id);

		} catch (error) {
			console.log(`Error de lectura`, error);
			throw new Error(error)
		}		
	}

	async deleteAll() {
		try {
			const contenido = await ProductoModel.deleteMany({});

		} catch (error) {
			throw new Error(error)
		}
	}
}

module.exports= MongoDB;















