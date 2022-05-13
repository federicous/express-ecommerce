let {connection, mongoose} = require("../../../config/mongo");
let ElementoModel = require('../../../schema/carritos')
const { v4 } = require('uuid');

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
			console.log(nuevoElemento._id);	
			console.log(nuevoElementoModel);	
			return(nuevoElemento._id)	
			
		} catch (error) {
			console.log(`Error de lectura`, error);
			throw new Error(error)
		}
	}

	async saveSubElement(id,subElement) {
		try {
			let carritoActualizado = await ElementoModel.findById(id);
			carritoActualizado.productList.push(subElement) // subElement es un objeto: {idProducto: <id>, cantidad: <cantidad>}
			await ElementoModel.findByIdAndUpdate(id, carritoActualizado);
			return(carritoActualizado)
			
		} catch (error) {
			console.log(`Error de lectura`, error);
			throw new Error(error)
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
			console.log(`Error de lectura`, error);
			throw new Error(error)
		}	
	}

	async getById(id) {
		try {
			let mostrar = await ElementoModel.findById(id);
			return(mostrar)
		} catch (error) {
			console.log(`Error de lectura`, error);
			throw new Error(error)
		}	
	}

	async getSubElementsById(id) {
		try {
			let mostrar = await ElementoModel.findById(id);
			return(mostrar.productList)
		} catch (error) {
			console.log(`Error de lectura`, error);
			throw new Error(error)
		}	
	}

	async getAll() {
		try {
			let allElements = await ElementoModel.find({});
			// console.log(allElements);
			return(allElements)
			
		} catch (error) {
			console.log(`Error de lectura`, error);
			throw new Error(error)
		}	
	}

	async deleteById(id) {
		try {
			// let borrar = await ElementoModel.deleteOne({"_id": id});
			let borrar = await ElementoModel.findByIdAndDelete(id);

		} catch (error) {
			console.log(`Error de lectura`, error);
			throw new Error(error)
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
			console.log(`Error de lectura`, error);
			throw new Error(error)
		}		
	}

	async deleteAll() {
		try {
			const contenido = await ElementoModel.deleteMany({});

		} catch (error) {
			throw new Error(error)
		}
	}
}

module.exports= MongoDB;















