let ProductoModel = require('../../../schema/productos')
const pino = require('../../../utils/logger/pino')

class MongoDB {

	async getAllNames(patron = "a") {
		try {
			// let allProducts = await ProductoModel.find({name: {$regex:`.*(?i)${patron}.*`}})


		let allProducts = await ProductoModel.find(
			{$or: 
				[
					{name: {$regex: `(^|.*\\h)(?i)${patron}.*`}}, 
					{code: { $regex: `${patron}.*`}},
				]
			}) // matchea todo el nombre del producto si el mismo contiene palabras que comienzan con el patron (se debe escapar el "\")
			return (allProducts)

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}
	}

	async getAll() {
		try {
			let allProducts = await ProductoModel.find({})
			return (allProducts)

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}
	}

}

module.exports = MongoDB;