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

	// async getById(id) {
	// 	try {
	// 		let mostrar = await ProductoModel.findById(id);
	// 		return (mostrar)
	// 	} catch (error) {
	// 		pino.error(`Se produjo un error: ${error}`)
	// 		throw new Error(error)
	// 	}
	// }

	// async getAll() {
	// 	try {
	// 		let allProducts = await ProductoModel.find({}).sort({name:1});
	// 		return (allProducts)

	// 	} catch (error) {
	// 		pino.error(`Se produjo un error: ${error}`)
	// 		throw new Error(error)
	// 	}
	// }



	// async getByObject(element) {
	// 	try {
	// 		let allProducts = await ProductoModel.find(element,"-_id");
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
			let allProducts = await ProductoModel.find({oferta:"si"}).sort({name:1, color:1, code:1}).skip(skip).limit(PAGE_SIZE);
			let total = await ProductoModel.countDocuments({})
			// return (allProducts)
			return ({allProducts: allProducts,total: total})

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}
	}

	// async getAllCategory(category) {
	// 	try {
	// 		let allProducts = await ProductoModel.find({label: category})
	// 		return (allProducts)

	// 	} catch (error) {
	// 		pino.error(`Se produjo un error: ${error}`)
	// 		throw new Error(error)
	// 	}
	// }

	// async getAllCategoryPage(category,page,pageSize) {
	// 	try {
	// 		const PAGE_SIZE = pageSize; // Similar a 'límite'
	// 		const skip = (page - 1) * PAGE_SIZE;
	// 		let allProducts = await ProductoModel.find({label: category}).sort({name:1, color:1, code:1}).skip(skip).limit(PAGE_SIZE);
	// 		// let total = await ProductoModel.find({label: category}).countDocuments()
	// 		let total = await ProductoModel.countDocuments({label: category})
	// 		return ({allProducts: allProducts,total: total})

	// 	} catch (error) {
	// 		pino.error(`Se produjo un error: ${error}`)
	// 		throw new Error(error)
	// 	}
	// }

	// async getAllCategoryPageLista(category,page,pageSize,lista) {
	// 	try {
	// 		const PAGE_SIZE = pageSize; // Similar a 'límite'
	// 		const skip = (page - 1) * PAGE_SIZE;
	// 		let allProducts = await ProductoModel.find({lista: lista, label: category}).sort({name:1, color:1, code:1}).skip(skip).limit(PAGE_SIZE);
	// 		// let total = await ProductoModel.find({label: category}).countDocuments()
	// 		let total = await ProductoModel.countDocuments({lista: lista, label: category})
	// 		return ({allProducts: allProducts,total: total})

	// 	} catch (error) {
	// 		pino.error(`Se produjo un error: ${error}`)
	// 		throw new Error(error)
	// 	}
	// }

	// async getAllPageLista(category,page,pageSize,lista) {
	// 	try {
	// 		const PAGE_SIZE = pageSize; // Similar a 'límite'
	// 		const skip = (page - 1) * PAGE_SIZE;
	// 		let allProducts = await ProductoModel.find({lista: lista}).sort({name:1, color:1, code:1}).skip(skip).limit(PAGE_SIZE);
	// 		// let total = await ProductoModel.find({label: category}).countDocuments()
	// 		let total = await ProductoModel.countDocuments({lista: lista})
	// 		return ({allProducts: allProducts,total: total})

	// 	} catch (error) {
	// 		pino.error(`Se produjo un error: ${error}`)
	// 		throw new Error(error)
	// 	}
	// }

}

module.exports = MongoDB;