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
						pino.info(`ya existe un producto con el mismo código ${element.code} en la lista ${element.lista}`);
						await ProductoModel.findOneAndUpdate({code: `${element.code}`, lista: `${element.lista}`}, element)
						return{message:`ya se modificó el producto ${element.code} en la lista ${element.lista}`}
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
					pino.info(`ya existe un producto con el mismo código ${producto.code}`);
					if (verificarExistente[0].image!="sin_imagen.jpg" && imageName && await exists(__dirname + `/../../../uploads/${verificarExistente[0].image}` )) {
						// let imagePath = path.join(__dirname, `../../../uploads/${verificarExistente[0].image}`)
						await fs.unlink(__dirname + `/../../../uploads/${verificarExistente[0].image}`)	
					}
					if (imageName) {
						producto.image = imageName;
					}
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
								pino.info(`ya existe un producto con el mismo código ${element.code} en la lista ${element.lista}`);
								await ProductoModel.findOneAndUpdate({code: `${element.code}`}, element)
								return{message:`ya se modificó el producto ${element.code} en la lista ${element.lista}`}
							} else {
								element.timestamp = Date.now();
								let agregarProductoModel = new ProductoModel(element);
								let agregarProducto = await agregarProductoModel.save();
								pino.info(agregarProducto);
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
			let allProducts = await ProductoModel.find({});
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
			let allProducts = await ProductoModel.find({label: category}).skip(skip).limit(PAGE_SIZE);
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
			let allProducts = await ProductoModel.find({lista: lista, label: category}).skip(skip).limit(PAGE_SIZE);
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
			let allProducts = await ProductoModel.find({lista: lista}).skip(skip).limit(PAGE_SIZE);
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