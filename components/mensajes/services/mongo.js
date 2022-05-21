// let {connection, mongoose} = require("../config/mongo");
let {connection, mongoose} = require("../../../config/mongo");
// let ProductoModel = require('../schema/productos')
let ProductoModel = require('../../../schema/productos')
const pino = require('../../../utils/logger/pino')

class MongoDB {


	async save(producto) {
		try {
			producto.timestamp=Date.now();
			let agregarProductoModel= new ProductoModel(producto);
			let agregarProducto = await agregarProductoModel.save();
			pino.info(agregarProducto);		
			
		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			
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
			pino.error(`Se produjo un error: ${error}`)
			
		}	
	}

	async getById(id) {
		try {
			let mostrar = await ProductoModel.findById(id);
			return(mostrar)
		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			
		}	
	}

	async getAll() {
		try {
			let allProducts = await ProductoModel.find({});
			// pino.info(allProducts);
			return(allProducts)
			
		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			
		}	
	}

	async deleteById(id) {
		try {
			// let borrar = await ProductoModel.deleteOne({"_id": id});
			let borrar = await ProductoModel.findByIdAndDelete(id);

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			
		}		
	}

	async deleteAll() {
		try {
			const contenido = await ProductoModel.deleteMany({});

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)

		}
	}
}

module.exports= MongoDB;















