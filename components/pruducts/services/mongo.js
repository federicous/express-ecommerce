let {
	connection,
	mongoose
} = require("../../../config/mongo");
let ProductoModel = require('../../../schema/productos')
const pino = require('../../../utils/logger/pino')

class MongoDB {


	async save(producto) {
		try {
			if (Array.isArray(producto)) {
				producto.forEach(async element => {
					let verificarExistente = await ProductoModel.find({code: `${element.code}`})
					if (verificarExistente.length) {
						console.log(`ya existe un producto con el mismo código ${element.code}`);
						return{message:`ya existe el producto ${element.code}`}
					} else {
						element.timestamp = Date.now();
						let agregarProductoModel = new ProductoModel(element);
						let agregarProducto = await agregarProductoModel.save();
						pino.info(agregarProducto);
					}
				});

			} else {
				let verificarExistente = await ProductoModel.find({code: `${element.code}`})
				if (verificarExistente.length) {
					console.log(`ya existe un producto con el mismo código ${element.code}`);
					return{message:`ya existe el producto ${producto.code}`}
				} else {
					producto.timestamp = Date.now();
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

	async deleteById(id) {
		try {
			let borrar = await ProductoModel.findByIdAndDelete(id);

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