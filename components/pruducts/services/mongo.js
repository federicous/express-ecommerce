const fs = require('fs').promises
let ProductoModel = require('../../../schema/productos')
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

	async save(producto, imageName) {
		try {
			if (Array.isArray(producto)) {
				producto.forEach(async element => {
					let verificarExistente = await ProductoModel.find({code: `${element.code}`, lista: `${element.lista}`})
					if (verificarExistente.length) {
						pino.info(`ya existe un producto con el mismo código ${element.code} en la lista ${element.lista}`);
						return{message:`ya existe el producto ${element.code} en la lista ${element.lista}`}
					} else {
						element.timestamp = Date.now();
						let agregarProductoModel = new ProductoModel(element);
						let agregarProducto = await agregarProductoModel.save();
						pino.info(agregarProducto);
					}
				});

			} else {
				let verificarExistente = await ProductoModel.find({code: `${producto.code}`, lista: `${producto.lista}`})
				if (verificarExistente.length) {
					console.log(`ya existe un producto con el mismo código ${producto.code}`);
					return{message:`ya existe el producto ${producto.code}`}
				} else {
					producto.timestamp = Date.now();
					producto.image = imageName;
					let agregarProductoModel = new ProductoModel(producto);
					let agregarProducto = await agregarProductoModel.save();
					pino.info(agregarProducto);
				}
			}


			// producto.timestamp=Date.now();
			// let agregarProductoModel= new ProductoModel(producto);
			// let agregarProducto = await agregarProductoModel.save();
			// pino.info(agregarProducto);		

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}
	}
	async modify(producto, id) {
		try {
			let modificar = await ProductoModel.findByIdAndUpdate(id, producto);
			return (modificar)


		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}
	}

	async modifyAll(producto, imageName) {
		try {
			// let modificar = await ProductoModel.findByIdAndUpdate(id, producto);
			// return (modificar)

			if (Array.isArray(producto)) {
				producto.forEach(async element => {
					let verificarExistente = await ProductoModel.find({code: `${element.code}`, lista: `${element.lista}`})
					if (verificarExistente.length) {
						pino.info(`ACTUALIZANDO producto código ${element.code} en la lista ${element.lista}`);
						element.timestamp = Date.now();
						await ProductoModel.findOneAndUpdate({code: `${element.code}`, lista: `${element.lista}`}, element)
						return{message:`ya se modificó el producto ${element.code} en la lista ${element.lista}`}
					} else {
						pino.info(`AGREGANDO producto NUEVO con código ${element.code} en la lista ${element.lista}`);
						element.timestamp = Date.now();
						let agregarProductoModel = new ProductoModel(element);
						let agregarProducto = await agregarProductoModel.save();
						pino.info(agregarProducto);
					}
				});

			} else {
				let verificarExistente = await ProductoModel.find({code: `${producto.code}`, lista: `${producto.lista}`})
				if (verificarExistente.length) {
					pino.info(`ya existe un producto con el mismo código ${producto.code}`);
					if (verificarExistente[0].image!="sin_imagen.jpg" && imageName && await exists(__dirname + `/../../../uploads/${verificarExistente[0].image}` )) {
						// let imagePath = path.join(__dirname, `../../../uploads/${verificarExistente[0].image}`)
						await fs.unlink(__dirname + `/../../../uploads/${verificarExistente[0].image}`)	
					}
					if (imageName) {
						producto.image = imageName;
					}
					producto.timestamp = Date.now();
					let updateProduct = await ProductoModel.findOneAndUpdate({code: `${producto.code}`, lista: `${producto.lista}`}, producto )
					return {message:`ya se modificó el producto ${producto.code}`, resultado:updateProduct}
				} else {
					producto.timestamp = Date.now();
					producto.image = imageName;
					let agregarProductoModel = new ProductoModel(producto);
					let agregarProducto = await agregarProductoModel.save();
					pino.info(agregarProducto);
				}
			}


		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}
	}


			async modifyAllCode(producto, imageName) {
				try {
					// let modificar = await ProductoModel.findByIdAndUpdate(id, producto);
					// return (modificar)
		
					if (Array.isArray(producto)) {
						producto.forEach(async element => {
							let verificarExistente = await ProductoModel.find({code: `${element.code}`})
							if (verificarExistente.length) {
								pino.info(`ACTUALIZANDO producto código ${element.code} en la lista ${element.lista}`);
								element.timestamp = Date.now();
								await ProductoModel.findOneAndUpdate({code: `${element.code}`}, element)
								return{message:`ya se modificó el producto ${element.code} en la lista ${element.lista}`}
							} else {
								pino.info(`AGREGANDO producto NUEVO con código ${element.code} en la lista ${element.lista}`);
								element.timestamp = Date.now();
								let agregarProductoModel = new ProductoModel(element);
								agregarProductoModel.isNew = true
								let agregarProducto = await agregarProductoModel.save();
								// pino.info(agregarProducto);
							}
						});
		
					} else {
						let verificarExistente = await ProductoModel.find({code: `${producto.code}`})
						if (verificarExistente.length) {
							pino.info(`ya existe un producto con el mismo código ${producto.code}`);
							if (verificarExistente[0].image!="sin_imagen.jpg" && imageName && await exists(__dirname + `/../../../uploads/${verificarExistente[0].image}` )) {
								// let imagePath = path.join(__dirname, `../../../uploads/${verificarExistente[0].image}`)
								await fs.unlink(__dirname + `/../../../uploads/${verificarExistente[0].image}`)	
							}
							if (imageName) {
								producto.image = imageName;
							}
							producto.timestamp = Date.now();
							let updateProduct = await ProductoModel.findOneAndUpdate({code: `${producto.code}`}, producto )
							return {message:`ya se modificó el producto ${producto.code}`, resultado:updateProduct}
						} else {
							producto.timestamp = Date.now();
							producto.image = imageName;
							let agregarProductoModel = new ProductoModel(producto);
							let agregarProducto = await agregarProductoModel.save();
							pino.info(agregarProducto);
						}
					}
				} catch (error) {
					pino.error(`Se produjo un error: ${error}`)
					throw new Error(error)
				}
			}


			async modifyAllCodeRepeated(producto, imageName) {
				try {
					// let modificar = await ProductoModel.findByIdAndUpdate(id, producto);
					// return (modificar)
		
					if (Array.isArray(producto)) {
						pino.info(`Cantidad de productos con repetidos: ${producto.length}`)
						/* Crear array sin codigos repetidos elegiendo el de menor cantidad */
						const uniqueProducts = producto.reduce((hashMap, product) => {
						if (!hashMap[product.code] || hashMap[product.code].unidades > product.unidades) {
							hashMap[product.code] = product;
						}
						return hashMap;
						}, {});

						const finalProducts = Object.values(uniqueProducts);
						pino.info(`Cantidad de productos sin repetidos: ${finalProducts.length}`)

						finalProducts.forEach(async element => {
							let verificarExistente = await ProductoModel.find({code: `${element.code}`})
							if (verificarExistente.length && element.code) {
								pino.info(`ACTUALIZANDO producto código ${element.code} en la lista ${element.lista}`);
								element.timestamp = Date.now();
								await ProductoModel.findOneAndUpdate({code: `${element.code}`}, element)
								return{message:`ya se modificó el producto ${element.code} en la lista ${element.lista}`}
							} else if (element.code) {
								pino.info(`AGREGANDO producto NUEVO con código ${element.code} en la lista ${element.lista}`);
								element.timestamp = Date.now();
								let agregarProductoModel = new ProductoModel(element);
								agregarProductoModel.isNew = true
								let agregarProducto = await agregarProductoModel.save();
								// pino.info(agregarProducto);
							}
						});

						return finalProducts
		
					} else {
						let verificarExistente = await ProductoModel.find({code: `${producto.code}`})
						if (verificarExistente.length) {
							pino.info(`ya existe un producto con el mismo código ${producto.code}`);
							if (verificarExistente[0].image!="sin_imagen.jpg" && imageName && await exists(__dirname + `/../../../uploads/${verificarExistente[0].image}` )) {
								// let imagePath = path.join(__dirname, `../../../uploads/${verificarExistente[0].image}`)
								await fs.unlink(__dirname + `/../../../uploads/${verificarExistente[0].image}`)	
							}
							if (imageName) {
								producto.image = imageName;
							}
							producto.timestamp = Date.now();
							let updateProduct = await ProductoModel.findOneAndUpdate({code: `${producto.code}`}, producto )
							return {message:`ya se modificó el producto ${producto.code}`, resultado:updateProduct}
						} else {
							producto.timestamp = Date.now();
							producto.image = imageName;
							let agregarProductoModel = new ProductoModel(producto);
							let agregarProducto = await agregarProductoModel.save();
							pino.info(agregarProducto);
						}
					}
				} catch (error) {
					pino.error(`Se produjo un error: ${error}`)
					throw new Error(error)
				}
			}

			/* Para actualizar listas desde el panel, no agrega nuevos productos */
			async modifyAllCodeNotAdd(producto, imageName) {
				try {
					// let modificar = await ProductoModel.findByIdAndUpdate(id, producto);
					// return (modificar)
		
					if (Array.isArray(producto)) {
						producto.forEach(async element => {
							let verificarExistente = await ProductoModel.find({code: `${element.code}`, lista: `${element.lista}`})
							if (verificarExistente.length) {
								pino.info(`Actualizando producto código ${element.code} en la lista ${element.lista}`);
								element.timestamp = Date.now();
								await ProductoModel.findOneAndUpdate({code: `${element.code}`}, element)
								return{message:`ya se modificó el producto ${element.code} en la lista ${element.lista}`}
							} else {
								pino.info(`NO EXISTE un producto con el código ${element.code} en la lista ${element.lista}`);
								return{message:`NO EXISTE un producto con codigo ${element.code} en la lista ${element.lista}`}
								// element.timestamp = Date.now();
								// let agregarProductoModel = new ProductoModel(element);
								// let agregarProducto = await agregarProductoModel.save();
								// pino.info(agregarProducto);
							}
						});
		
					} else {
						return{message:`El elemento no es un Array}`}

						// let verificarExistente = await ProductoModel.find({code: `${producto.code}`})
						// if (verificarExistente.length) {
						// 	pino.info(`ya existe un producto con el mismo código ${producto.code}`);
						// 	if (verificarExistente[0].image!="sin_imagen.jpg" && imageName && await exists(__dirname + `/../../../uploads/${verificarExistente[0].image}` )) {
						// 		// let imagePath = path.join(__dirname, `../../../uploads/${verificarExistente[0].image}`)
						// 		await fs.unlink(__dirname + `/../../../uploads/${verificarExistente[0].image}`)	
						// 	}
						// 	if (imageName) {
						// 		producto.image = imageName;
						// 	}
						// 	let updateProduct = await ProductoModel.findOneAndUpdate({code: `${producto.code}`}, producto )
						// 	return {message:`ya se modificó el producto ${producto.code}`, resultado:updateProduct}
						// } else {
						// 	producto.timestamp = Date.now();
						// 	producto.image = imageName;
						// 	let agregarProductoModel = new ProductoModel(producto);
						// 	let agregarProducto = await agregarProductoModel.save();
						// 	pino.info(agregarProducto);
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
			// 		let mostrar = await ProductoModel.aggregate([
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
			// 			ProductoModel.remove({
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
			let mostrar = await ProductoModel.findById(id);
			return (mostrar)
		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}
	}

	async getAll() {
		try {
			let allProducts = await ProductoModel.find({}).sort({name:1});
			return (allProducts)

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}
	}



	async getByObject(element) {
		try {
			let allProducts = await ProductoModel.find(element,"-_id");
			return (allProducts)

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}
	}

	async getAllPage(page,pageSize) {
		try {
			const PAGE_SIZE = pageSize; // Similar a 'límite'
			const skip = (page - 1) * PAGE_SIZE;
			let allProducts = await ProductoModel.find({}).skip(skip).limit(PAGE_SIZE);
			let total = await ProductoModel.countDocuments({})
			// return (allProducts)
			return ({allProducts: allProducts,total: total})

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}
	}

	async getAllCategory(category) {
		try {
			let allProducts = await ProductoModel.find({label: category})
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
			let allProducts = await ProductoModel.find({label: category}).sort({name:1, color:1, code:1}).skip(skip).limit(PAGE_SIZE);
			// let total = await ProductoModel.find({label: category}).countDocuments()
			let total = await ProductoModel.countDocuments({label: category})
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
			let allProducts = await ProductoModel.find({lista: lista, label: category}).sort({name:1, color:1, code:1}).skip(skip).limit(PAGE_SIZE);
			// let total = await ProductoModel.find({label: category}).countDocuments()
			let total = await ProductoModel.countDocuments({lista: lista, label: category})
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
			let allProducts = await ProductoModel.find({lista: lista}).sort({name:1, color:1, code:1}).skip(skip).limit(PAGE_SIZE);
			// let total = await ProductoModel.find({label: category}).countDocuments()
			let total = await ProductoModel.countDocuments({lista: lista})
			return ({allProducts: allProducts,total: total})

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}
	}

	async deleteById(id) {
		try {
			// let borrar = await ProductoModel.deleteOne({code: `${element.code}`, lista: `${element.lista}`})
			let borrar = await ProductoModel.findByIdAndDelete(id);
			return borrar
		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
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

module.exports = MongoDB;