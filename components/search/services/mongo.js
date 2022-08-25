let ProductoModel = require('../../../schema/productos')
const pino = require('../../../utils/logger/pino')

class MongoDB {

	// async getAllNames(patron = "a") {
	// 	try {
	// 		// let allProducts = await ProductoModel.find({name: {$regex:`.*(?i)${patron}.*`}})


	// 	let allProducts = await ProductoModel.find(
	// 		{$or: 
	// 			[
	// 				{name: {$regex: `(^|.*\\h)(?i)${patron}.*`}}, 
	// 				{code: { $regex: `${patron}.*`}},
	// 			]
	// 		}) // matchea todo el nombre del producto si el mismo contiene palabras que comienzan con el patron (se debe escapar el "\")
	// 		return (allProducts)

	// 	} catch (error) {
	// 		pino.error(`Se produjo un error: ${error}`)
	// 		throw new Error(error)
	// 	}
	// }

	async getAllNamesPage(patron = "a",page,pageSize) {
		try {
			// let allProducts = await ProductoModel.find({name: {$regex:`.*(?i)${patron}.*`}})

			const PAGE_SIZE = pageSize; // Similar a 'límite'
			const skip = (page - 1) * PAGE_SIZE;
			let allProducts = await ProductoModel.find({
				$or: 
				[
					{name: {$regex: `(^|.*\\h)(?i)${patron}.*`}}, 
					{code: { $regex: `${patron}.*`}},
					{label: { $regex: `${patron}.*`}},
					{linea: { $regex: `${patron}.*`}},
					{color: { $regex: `${patron}.*`}},
				]
			})
			.skip(skip).limit(PAGE_SIZE);
			// matchea todo el nombre del producto si el mismo contiene palabras que comienzan con el patron (se debe escapar el "\")
			let total = await ProductoModel.countDocuments({
				$or: 
				[
					{name: {$regex: `(^|.*\\h)(?i)${patron}.*`}}, 
					{code: { $regex: `${patron}.*`}},
					{label: { $regex: `${patron}.*`}},
					{linea: { $regex: `${patron}.*`}},
					{color: { $regex: `${patron}.*`}},
				]
			})

			return ({allProducts: allProducts,total: total})

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}
	}

	// async getAll() {
	// 	try {
	// 		let allProducts = await ProductoModel.find({})
	// 		return (allProducts)

	// 	} catch (error) {
	// 		pino.error(`Se produjo un error: ${error}`)
	// 		throw new Error(error)
	// 	}
	// }

	async getAllPage(page,pageSize) {
		try {
			const PAGE_SIZE = pageSize; // Similar a 'límite'
			const skip = (page - 1) * PAGE_SIZE;
			let allProducts = await ProductoModel.find({}).skip(skip).limit(PAGE_SIZE);
			let total = await ProductoModel.countDocuments({})
			return ({allProducts: allProducts,total: total})

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}
	}

}

module.exports = MongoDB;