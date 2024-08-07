let ProductoModel = require('../../../schema/productos')
const pino = require('../../../utils/logger/pino')

class MongoDB {

	async getAll(identificador) {
		try {
			let allProducts = await ProductoModel.find({}).select(`${identificador} -_id`);
			return (allProducts.filter(Boolean))

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}
	}

	async getAllLista(identificador,lista) {
		try {
			let allProducts = await ProductoModel.find({lista: `${lista}`}).select(`${identificador} -_id`);
			return (allProducts.filter(Boolean))

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}
	}

}

module.exports = MongoDB;