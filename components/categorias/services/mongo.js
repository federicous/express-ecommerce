let ProductoModel = require('../../../schema/productos')
const pino = require('../../../utils/logger/pino')

class MongoDB {

	async getAll(identificador) {
		try {
			let allProducts = await ProductoModel.find({}).select(`${identificador} -_id`);
			return (allProducts)

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}
	}
}

module.exports = MongoDB;