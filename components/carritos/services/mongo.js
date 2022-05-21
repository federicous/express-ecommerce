let {connection, mongoose} = require("../../../config/mongo");
let ElementoModel = require('../../../schema/carritos')
const { v4 } = require('uuid');
const pino = require('../../../utils/logger/pino')

class MongoDB {


	async save(carrito) {
		try {
			// elemento.timestamp=Date.now();
			// let agregarElementoModel= new ElementoModel(elemento);
			let nuevoElementoModel= new ElementoModel();
			nuevoElementoModel.id=v4();
			nuevoElementoModel.timestamp = Date.now();   
			nuevoElementoModel.email=carrito.email;
			nuevoElementoModel.address=carrito.address;
			nuevoElementoModel.productList=[]
			let nuevoElemento = await nuevoElementoModel.save();
			pino.info(nuevoElemento._id);	
			pino.info(nuevoElementoModel);	
			return(nuevoElemento._id)	
			
		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			
		}
	}

	async saveSubElement(id,subElement) {
		try {
			let carritoActualizado = await ElementoModel.findById(id);
			carritoActualizado.productList.push(subElement) // subElement es un objeto: {idProducto: <id>, cantidad: <cantidad>}
			await ElementoModel.findByIdAndUpdate(id, carritoActualizado);
			return(carritoActualizado)
			
		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			
		}
	}


	async modify(elemento,id) {
		try {
			// let modificar = await ElementoModel.updateOne({_id:id}, {
			// 	$set: elemento
			// });
			let modificar = await ElementoModel.findByIdAndUpdate(id, elemento);
			return(modificar)


		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			
		}	
	}

	async getById(id) {
		try {
			let mostrar = await ElementoModel.findById(id);
			return(mostrar)
		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			
		}	
	}

	async getSubElementsById(id) {
		try {
			let mostrar = await ElementoModel.findById(id);
			return(mostrar.productList)
		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			
		}	
	}

	async getAll() {
		try {
			let allElements = await ElementoModel.find({});
			// pino.info(allElements);
			return(allElements)
			
		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			
		}	
	}

	async deleteById(id) {
		try {
			// let borrar = await ElementoModel.deleteOne({"_id": id});
			let borrar = await ElementoModel.findByIdAndDelete(id);

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			
		}		
	}

	async deleteSubElementById(id, id_prod) {
		try {
			let carritoActualizado = await ElementoModel.findById(id);
			let nuevaProductList = carritoActualizado.productList.filter((item) => item.id !== `${id_prod}`);
			carritoActualizado.productList = nuevaProductList;
			await ElementoModel.findByIdAndUpdate(id, carritoActualizado);
			return(carritoActualizado)

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			
		}		
	}

	async deleteAll() {
		try {
			const contenido = await ElementoModel.deleteMany({});

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)

		}
	}
}

module.exports= MongoDB;















