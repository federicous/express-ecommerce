let {connection, mongoose} = require("../../../config/mongo");
let ElementoModel = require('../../../schema/carritos');
let ProductoModel = require('../../../schema/productos')
const { v4 } = require('uuid');
const pino = require('../../../utils/logger/pino')

class MongoDB {

	async save(carrito) {
		try {
			let cart = await ElementoModel.findOne({email: carrito.email});
			if (cart) {
				return (cart._id)
			}


			let nuevoElementoModel= new ElementoModel();
			nuevoElementoModel.id=v4();
			nuevoElementoModel.timestamp = Date.now();   
			nuevoElementoModel.email=carrito.email;
			nuevoElementoModel.address=carrito.address;
			nuevoElementoModel.productList=[]
			let nuevoElemento = await nuevoElementoModel.save();
			pino.info(nuevoElemento._id);	
			return(nuevoElemento._id)	
			
		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			
		}
	}

	async saveSubElement(carritoId,subElement) {
		try {
			let carritoActualizado = await ElementoModel.findById(carritoId);
			let nuevaProductList = carritoActualizado.productList.filter((item) => item.id !== `${subElement.id}`);
			carritoActualizado.productList=nuevaProductList;
			carritoActualizado.productList.push(subElement) // subElement es un objeto: {idProducto: <id>, cantidad: <cantidad>}
			await ElementoModel.findByIdAndUpdate(carritoId, carritoActualizado);
			return(carritoActualizado)
			
		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			
		}
	}


	async saveSubElementReact(carritoId,subElement) {
		try {
			// Si es array sobreescribo el carrito
			if (Array.isArray(subElement)) {
				let carritoActualizado = await ElementoModel.findById(carritoId);
				carritoActualizado.productList=subElement;
				await ElementoModel.findByIdAndUpdate(carritoId, carritoActualizado);					
				return(carritoActualizado)
			} else {
				let carritoActualizado = await ElementoModel.findById(carritoId);
				let nuevaProductList = carritoActualizado.productList.filter((item) => item.id !== `${subElement.id}`);
				carritoActualizado.productList=nuevaProductList;
				carritoActualizado.productList.push(subElement)
				await ElementoModel.findByIdAndUpdate(carritoId, carritoActualizado);
				return(carritoActualizado)
			}
			
		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			
		}
	}

	/* Actualizo los datos de los productos en los carritos */
	async updateProductList() {
		try {
			let allCarritos = await ElementoModel.find({});

			await Promise.all(allCarritos.map( async element => {
				let carrito=element.productList;
				console.log(`>>>>>>>>>> carrito de ${element.email}`);

				let carritoUpdated = [];
				await Promise.all(carrito.map( async item => {
					// let originalProduct = await ProductoModel.find({_id: `${item._id}`}).select(`-_id`);
					let originalProduct = await ProductoModel.findById(`${item._id}`).select(`-_id`);
					let itemUpdated = {};
					for (let attrname in item) { itemUpdated[attrname] = originalProduct[attrname] ? originalProduct[attrname] : item[attrname]};
					carritoUpdated.push(itemUpdated)
				}))

				// console.log(`########## sin actualizar`);
				// console.log(carrito);
				// console.log(`########## actualizado`);
				// console.log(carritoUpdated);

				// element.productList = [...carritoUpdated]
				let carritoId = element["_id"]

				let carritoActualizado = await ElementoModel.findById(carritoId);
				carritoActualizado.productList=[...carritoUpdated];
				await ElementoModel.findByIdAndUpdate(carritoId, carritoActualizado);	

			}))

			return allCarritos
			
			
		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			
		}
	}


	async modify(elemento,id) {
		try {
			let modificar = await ElementoModel.findByIdAndUpdate(id, elemento);
			return(modificar)


		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			
		}	
	}

	async getById(id) {
		try {
			let mostrar = await ElementoModel.findById(id);
			pino.info(mostrar)
			return(mostrar)
		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			
		}	
	}

	async getByEmail(email) {
		try {
			let mostrar = await ElementoModel.findOne({email: email});
			return(mostrar)
		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			
		}	
	}
	async getSubElementsById(id) {
		try {
			let mostrar = await ElementoModel.findById(id);
			console.log(`#################### Lista de productos ################`);
			console.log(mostrar.productList);
			return(mostrar.productList)

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			
		}	
	}

	async getAll() {
		try {
			let allElements = await ElementoModel.find({});
			return(allElements)
			
		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			
		}	
	}

	async deleteById(id) {
		try {
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















