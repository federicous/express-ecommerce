const fs = require('fs').promises
let ElementModel = require('../../../schema/pagos')
// let ElementModel2 = require('../../../schema/facturaProveedor')
const pino = require('../../../utils/logger/pino')
// var path = require('path');

async function exists (path) {  
	try {
	  await fs.access(path)
	  return true
	} catch {
	  return false
	}
      }

class MongoDB {

	async save(element, imageName) {
		try {
			if (Array.isArray(element)) {
				element.forEach(async element => {
					let verificarExistente = await ElementModel.find({code: `${element.code}`})
					if (verificarExistente.length) {
						pino.info(`ya existe un element con el mismo código ${element.code} en la lista ${element.lista}`);
						return{message:`ya existe el element ${element.code} en la lista ${element.lista}`}
					} else {
						element.timestamp = Date.now();
						let agregarElementModel = new ElementModel(element);
						let agregarElement = await agregarElementModel.save();
						return {message:`Se agregó el elemento ${element.code}`, resultado:agregarElement}
					}
				});

			} else {
				// let verificarExistente = await ElementModel2.find({code: `${element.code}`}) // VERIFICO contra el de facturas que exista el código
				// if (verificarExistente.length) {	// NEGADO PARA COBROS
				// 	console.log(`NO existe un element con el mismo código ${element.code}`);
				// 	return{message:`NO existe el element ${element.code}`}
				// } else {
					element.timestamp = Date.now();
					let agregarElementModel = new ElementModel(element);
					let agregarElement = await agregarElementModel.save();
					return {message:`Se agregó el elemento ${element.code}`, resultado:agregarElement}
				// }
			}


			// element.timestamp=Date.now();
			// let agregarElementModel= new ElementModel(element);
			// let agregarElement = await agregarElementModel.save();
			// pino.info(agregarElement);		

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}
	}
	async modify(element, id) {
		try {
			let modificar = await ElementModel.findByIdAndUpdate(id, element);
			return (modificar)


		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}
	}

	async modifyAll(element) {
		try {
			// let modificar = await ElementModel.findByIdAndUpdate(id, element);
			// return (modificar)

			if (Array.isArray(element)) {
				element.forEach(async element => {
					let verificarExistente = await ElementModel.find({code: `${element.code}`, lista: `${element.lista}`})
					if (verificarExistente.length) {
						pino.info(`ACTUALIZANDO element código ${element.code} en la lista ${element.lista}`);
						element.timestamp = Date.now();
						await ElementModel.findOneAndUpdate({code: `${element.code}`, lista: `${element.lista}`}, element)
						return{message:`ya se modificó el element ${element.code} en la lista ${element.lista}`}
					} else {
						pino.info(`AGREGANDO element NUEVO con código ${element.code} en la lista ${element.lista}`);
						element.timestamp = Date.now();
						let agregarElementModel = new ElementModel(element);
						let agregarElement = await agregarElementModel.save();
						return {message:`Se agregó el elemento ${element.code}`, resultado:agregarElement}
						// pino.info(agregarElement);
					}
				});

			} else {
				let verificarExistente = await ElementModel.find({code: `${element.code}`, cliente: `${element.cliente}`})
				if (verificarExistente.length) {
					pino.info(`ya existe un element con el mismo código ${element.code}`);

					element.timestamp = Date.now();
					let updateProduct = await ElementModel.findOneAndUpdate({code: `${element.code}`, cliente: `${element.cliente}`}, element )
					return {message:`ya se modificó el element ${element.code}`, resultado:updateProduct}
				} else {
					element.timestamp = Date.now();
					element.image = imageName;
					let agregarElementModel = new ElementModel(element);
					let agregarElement = await agregarElementModel.save();
					return {message:`Se agregó el elemento ${element.code}`, resultado:agregarElement}
					// pino.info(agregarElement);
				}
			}


		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}
	}


			async modifyAllCode(element, imageName) {
				try {
					// let modificar = await ElementModel.findByIdAndUpdate(id, element);
					// return (modificar)
		
					if (Array.isArray(element)) {
						element.forEach(async element => {
							let verificarExistente = await ElementModel.find({code: `${element.code}`})
							if (verificarExistente.length) {
								pino.info(`ACTUALIZANDO element código ${element.code} en la lista ${element.lista}`);
								element.timestamp = Date.now();
								await ElementModel.findOneAndUpdate({code: `${element.code}`}, element)
								return{message:`ya se modificó el element ${element.code} en la lista ${element.lista}`}
							} else {
								pino.info(`AGREGANDO element NUEVO con código ${element.code} en la lista ${element.lista}`);
								element.timestamp = Date.now();
								let agregarElementModel = new ElementModel(element);
								agregarElementModel.isNew = true
								let agregarElement = await agregarElementModel.save();
								// pino.info(agregarElement);
							}
						});
		
					} else {
						let verificarExistente = await ElementModel.find({code: `${element.code}`})
						if (verificarExistente.length) {
							pino.info(`ya existe un element con el mismo código ${element.code}`);
							if (verificarExistente[0].image!="sin_imagen.jpg" && imageName && await exists(__dirname + `/../../../uploads/${verificarExistente[0].image}` )) {
								// let imagePath = path.join(__dirname, `../../../uploads/${verificarExistente[0].image}`)
								await fs.unlink(__dirname + `/../../../uploads/${verificarExistente[0].image}`)	
							}
							if (imageName) {
								element.image = imageName;
							}
							element.timestamp = Date.now();
							let updateProduct = await ElementModel.findOneAndUpdate({code: `${element.code}`}, element )
							return {message:`ya se modificó el element ${element.code}`, resultado:updateProduct}
						} else {
							element.timestamp = Date.now();
							element.image = imageName;
							let agregarElementModel = new ElementModel(element);
							let agregarElement = await agregarElementModel.save();
							pino.info(agregarElement);
						}
					}
				} catch (error) {
					pino.error(`Se produjo un error: ${error}`)
					throw new Error(error)
				}
			}


			async modifyAllCodeRepeated(element, imageName) {
				try {
					// let modificar = await ElementModel.findByIdAndUpdate(id, element);
					// return (modificar)
		
					if (Array.isArray(element)) {
						pino.info(`Cantidad de elements con repetidos: ${element.length}`)
						/* Crear array sin codigos repetidos elegiendo el de menor cantidad */
						const uniqueProducts = element.reduce((hashMap, product) => {
						if (!hashMap[product.code] || hashMap[product.code].unidades > product.unidades) {
							hashMap[product.code] = product;
						}
						return hashMap;
						}, {});

						const finalProducts = Object.values(uniqueProducts);
						pino.info(`Cantidad de elements sin repetidos: ${finalProducts.length}`)

						finalProducts.forEach(async element => {
							let verificarExistente = await ElementModel.find({code: `${element.code}`})
							if (verificarExistente.length && element.code) {
								pino.info(`ACTUALIZANDO element código ${element.code} en la lista ${element.lista}`);
								element.timestamp = Date.now();
								await ElementModel.findOneAndUpdate({code: `${element.code}`}, element)
								return{message:`ya se modificó el element ${element.code} en la lista ${element.lista}`}
							} else if (element.code) {
								pino.info(`AGREGANDO element NUEVO con código ${element.code} en la lista ${element.lista}`);
								element.timestamp = Date.now();
								let agregarElementModel = new ElementModel(element);
								agregarElementModel.isNew = true
								let agregarElement = await agregarElementModel.save();
								// pino.info(agregarElement);
							}
						});

						return finalProducts
		
					} else {
						let verificarExistente = await ElementModel.find({code: `${element.code}`})
						if (verificarExistente.length) {
							pino.info(`ya existe un element con el mismo código ${element.code}`);
							if (verificarExistente[0].image!="sin_imagen.jpg" && imageName && await exists(__dirname + `/../../../uploads/${verificarExistente[0].image}` )) {
								// let imagePath = path.join(__dirname, `../../../uploads/${verificarExistente[0].image}`)
								await fs.unlink(__dirname + `/../../../uploads/${verificarExistente[0].image}`)	
							}
							if (imageName) {
								element.image = imageName;
							}
							element.timestamp = Date.now();
							let updateProduct = await ElementModel.findOneAndUpdate({code: `${element.code}`}, element )
							return {message:`ya se modificó el element ${element.code}`, resultado:updateProduct}
						} else {
							element.timestamp = Date.now();
							element.image = imageName;
							let agregarElementModel = new ElementModel(element);
							let agregarElement = await agregarElementModel.save();
							pino.info(agregarElement);
						}
					}
				} catch (error) {
					pino.error(`Se produjo un error: ${error}`)
					throw new Error(error)
				}
			}

			/* Para actualizar listas desde el panel, no agrega nuevos elements */
			async modifyAllCodeNotAdd(element, imageName) {
				try {
					// let modificar = await ElementModel.findByIdAndUpdate(id, element);
					// return (modificar)
		
					if (Array.isArray(element)) {
						element.forEach(async element => {
							let verificarExistente = await ElementModel.find({code: `${element.code}`, lista: `${element.lista}`})
							if (verificarExistente.length) {
								pino.info(`Actualizando element código ${element.code} en la lista ${element.lista}`);
								element.timestamp = Date.now();
								await ElementModel.findOneAndUpdate({code: `${element.code}`}, element)
								return{message:`ya se modificó el element ${element.code} en la lista ${element.lista}`}
							} else {
								pino.info(`NO EXISTE un element con el código ${element.code} en la lista ${element.lista}`);
								return{message:`NO EXISTE un element con codigo ${element.code} en la lista ${element.lista}`}
								// element.timestamp = Date.now();
								// let agregarElementModel = new ElementModel(element);
								// let agregarElement = await agregarElementModel.save();
								// pino.info(agregarElement);
							}
						});
		
					} else {
						return{message:`El elemento no es un Array}`}

						// let verificarExistente = await ElementModel.find({code: `${element.code}`})
						// if (verificarExistente.length) {
						// 	pino.info(`ya existe un element con el mismo código ${element.code}`);
						// 	if (verificarExistente[0].image!="sin_imagen.jpg" && imageName && await exists(__dirname + `/../../../uploads/${verificarExistente[0].image}` )) {
						// 		// let imagePath = path.join(__dirname, `../../../uploads/${verificarExistente[0].image}`)
						// 		await fs.unlink(__dirname + `/../../../uploads/${verificarExistente[0].image}`)	
						// 	}
						// 	if (imageName) {
						// 		element.image = imageName;
						// 	}
						// 	let updateProduct = await ElementModel.findOneAndUpdate({code: `${element.code}`}, element )
						// 	return {message:`ya se modificó el element ${element.code}`, resultado:updateProduct}
						// } else {
						// 	element.timestamp = Date.now();
						// 	element.image = imageName;
						// 	let agregarElementModel = new ElementModel(element);
						// 	let agregarElement = await agregarElementModel.save();
						// 	pino.info(agregarElement);
						// }
					}
				} catch (error) {
					pino.error(`Se produjo un error: ${error}`)
					throw new Error(error)
				}
			}

			// async deleteDuplicated() {
			// 	try {					
			// 		/* ELIMINAR DUPLICADOS */
			// 		let mostrar = await ElementModel.aggregate([
			// 			{
			// 			"$group": {
			// 				_id: {code: "$code"},
			// 				codes: { $addToSet: "$_id" } ,
			// 				count: { $sum : 1 }
			// 			}
			// 			},
			// 			{
			// 			"$match": {
			// 				count: { "$gt": 1 }
			// 			}
			// 			}
			// 		]).forEach(function(doc) {
			// 			doc.codes.shift();
			// 			ElementModel.remove({
			// 			_id: {$in: doc.codes}
			// 			});
			// 		})
			// 		console.log(mostrar);
			// 		return (mostrar)
			// 	} catch (error) {
			// 		pino.error(`Se produjo un error: ${error}`)
			// 		throw new Error(error)
			// 	}
			// }

	async getById(id) {
		try {
			let mostrar = await ElementModel.findById(id);
			return (mostrar)
		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}
	}

	// async getAll() {
	// 	try {
	// 		let allProducts = await ElementModel.find({}).sort({name:1});
	// 		return (allProducts)

	// 	} catch (error) {
	// 		pino.error(`Se produjo un error: ${error}`)
	// 		throw new Error(error)
	// 	}
	// }


	async getByObject(element) {
		try {
			let allProducts = await ElementModel.find(element,"-_id");
			return (allProducts)

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}
	}

	async getAll() {
		try {
			let allElements = await ElementModel.find({});
			// return (allProducts)
			return ({resultado: allElements})

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}
	}

	async getAllCategory(category) {
		try {
			let allProducts = await ElementModel.find({label: category})
			return (allProducts)

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}
	}

	async getAllCategoryPage(category,page,pageSize) {
		try {
			const PAGE_SIZE = pageSize; // Similar a 'límite'
			const skip = (page - 1) * PAGE_SIZE;
			let allProducts = await ElementModel.find({label: category}).sort({name:1, color:1, code:1}).skip(skip).limit(PAGE_SIZE);
			// let total = await ElementModel.find({label: category}).countDocuments()
			let total = await ElementModel.countDocuments({label: category})
			return ({allProducts: allProducts,total: total})

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}
	}

	async getAllCategoryPageLista(category,page,pageSize,lista) {
		try {
			const PAGE_SIZE = pageSize; // Similar a 'límite'
			const skip = (page - 1) * PAGE_SIZE;
			let allProducts = await ElementModel.find({lista: lista, label: category}).sort({name:1, color:1, code:1}).skip(skip).limit(PAGE_SIZE);
			// let total = await ElementModel.find({label: category}).countDocuments()
			let total = await ElementModel.countDocuments({lista: lista, label: category})
			return ({allProducts: allProducts,total: total})

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}
	}

	async getAllPageLista(category,page,pageSize,lista) {
		try {
			const PAGE_SIZE = pageSize; // Similar a 'límite'
			const skip = (page - 1) * PAGE_SIZE;
			let allProducts = await ElementModel.find({lista: lista}).sort({name:1, color:1, code:1}).skip(skip).limit(PAGE_SIZE);
			// let total = await ElementModel.find({label: category}).countDocuments()
			let total = await ElementModel.countDocuments({lista: lista})
			return ({allProducts: allProducts,total: total})

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}
	}

	async deleteById(id) {
		try {
			// let borrar = await ElementModel.deleteOne({code: `${element.code}`, lista: `${element.lista}`})
			let borrar = await ElementModel.findByIdAndDelete(id);
			return borrar
		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}
	}

	async deleteAll() {
		try {
			const contenido = await ElementModel.deleteMany({});

		} catch (error) {
			throw new Error(error)
		}
	}
}

module.exports = MongoDB;