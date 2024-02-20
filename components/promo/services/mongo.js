const fs = require('fs').promises
let PromoModel = require('../../../schema/promo')
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

	async save(promo, imageName) {
		try {
			let verificarExistente = await PromoModel.find({})
			if (verificarExistente.length) {
				let id = verificarExistente[0]._id
				promo.image = imageName;
				promo.habilitar = promo.habilitar ? promo.habilitar : "off"
				// console.log(promo);
				let modificar = await PromoModel.findOneAndUpdate({_id: id}, promo);
				return modificar
			} else {
				promo.timestamp = Date.now();
				promo.image = imageName;
				promo.habilitar = promo.habilitar ? promo.habilitar : "off"
				// console.log(promo);
				let agregarPromoModel = new PromoModel(promo);
				let agregarPromo = await agregarPromoModel.save();
				pino.info(agregarPromo);
				return agregarPromo
			}
			

			// promo.timestamp=Date.now();
			// let agregarPromoModel= new PromoModel(promo);
			// let agregarPromo = await agregarPromoModel.save();
			// pino.info(agregarPromo);		

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}
	}
	async modify(promo, id) {
		try {
			let modificar = await PromoModel.findByIdAndUpdate(id, promo);
			return (modificar)


		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}
	}

	async modifyAll(promo, imageName) {
		try {
			// let modificar = await PromoModel.findByIdAndUpdate(id, promo);
			// return (modificar)

			if (Array.isArray(promo)) {
				promo.forEach(async element => {
					let verificarExistente = await PromoModel.find({code: `${element.code}`, lista: `${element.lista}`})
					if (verificarExistente.length) {
						pino.info(`ACTUALIZANDO promo código ${element.code} en la lista ${element.lista}`);
						element.timestamp = Date.now();
						await PromoModel.findOneAndUpdate({code: `${element.code}`, lista: `${element.lista}`}, element)
						return{message:`ya se modificó el promo ${element.code} en la lista ${element.lista}`}
					} else {
						pino.info(`AGREGANDO promo NUEVO con código ${element.code} en la lista ${element.lista}`);
						element.timestamp = Date.now();
						let agregarPromoModel = new PromoModel(element);
						let agregarPromo = await agregarPromoModel.save();
						pino.info(agregarPromo);
					}
				});

			} else {
				let verificarExistente = await PromoModel.find({code: `${promo.code}`, lista: `${promo.lista}`})
				if (verificarExistente.length) {
					pino.info(`ya existe un promo con el mismo código ${promo.code}`);
					if (verificarExistente[0].image!="sin_imagen.jpg" && imageName && await exists(__dirname + `/../../../uploads/${verificarExistente[0].image}` )) {
						// let imagePath = path.join(__dirname, `../../../uploads/${verificarExistente[0].image}`)
						await fs.unlink(__dirname + `/../../../uploads/${verificarExistente[0].image}`)	
					}
					if (imageName) {
						promo.image = imageName;
					}
					promo.timestamp = Date.now();
					let updatePromo = await PromoModel.findOneAndUpdate({code: `${promo.code}`, lista: `${promo.lista}`}, promo )
					return {message:`ya se modificó el promo ${promo.code}`, resultado:updatePromo}
				} else {
					promo.timestamp = Date.now();
					promo.image = imageName;
					let agregarPromoModel = new PromoModel(promo);
					let agregarPromo = await agregarPromoModel.save();
					pino.info(agregarPromo);
				}
			}


		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}
	}


			async modifyAllCode(promo, imageName) {
				try {
					// let modificar = await PromoModel.findByIdAndUpdate(id, promo);
					// return (modificar)
		
					if (Array.isArray(promo)) {
						promo.forEach(async element => {
							let verificarExistente = await PromoModel.find({code: `${element.code}`})
							if (verificarExistente.length) {
								pino.info(`ACTUALIZANDO promo código ${element.code} en la lista ${element.lista}`);
								element.timestamp = Date.now();
								await PromoModel.findOneAndUpdate({code: `${element.code}`}, element)
								return{message:`ya se modificó el promo ${element.code} en la lista ${element.lista}`}
							} else {
								pino.info(`AGREGANDO promo NUEVO con código ${element.code} en la lista ${element.lista}`);
								element.timestamp = Date.now();
								let agregarPromoModel = new PromoModel(element);
								agregarPromoModel.isNew = true
								let agregarPromo = await agregarPromoModel.save();
								// pino.info(agregarPromo);
							}
						});
		
					} else {
						let verificarExistente = await PromoModel.find({code: `${promo.code}`})
						if (verificarExistente.length) {
							pino.info(`ya existe un promo con el mismo código ${promo.code}`);
							if (verificarExistente[0].image!="sin_imagen.jpg" && imageName && await exists(__dirname + `/../../../uploads/${verificarExistente[0].image}` )) {
								// let imagePath = path.join(__dirname, `../../../uploads/${verificarExistente[0].image}`)
								await fs.unlink(__dirname + `/../../../uploads/${verificarExistente[0].image}`)	
							}
							if (imageName) {
								promo.image = imageName;
							}
							promo.timestamp = Date.now();
							let updatePromo = await PromoModel.findOneAndUpdate({code: `${promo.code}`}, promo )
							return {message:`ya se modificó el promo ${promo.code}`, resultado:updatePromo}
						} else {
							promo.timestamp = Date.now();
							promo.image = imageName;
							let agregarPromoModel = new PromoModel(promo);
							let agregarPromo = await agregarPromoModel.save();
							pino.info(agregarPromo);
						}
					}
				} catch (error) {
					pino.error(`Se produjo un error: ${error}`)
					throw new Error(error)
				}
			}


			async modifyAllCodeRepeated(promo, imageName) {
				try {
					// let modificar = await PromoModel.findByIdAndUpdate(id, promo);
					// return (modificar)
		
					if (Array.isArray(promo)) {
						pino.info(`Cantidad de promos con repetidos: ${promo.length}`)
						/* Crear array sin codigos repetidos elegiendo el de menor cantidad */
						const uniquePromos = promo.reduce((hashMap, promo) => {
						if (!hashMap[promo.code] || hashMap[promo.code].unidades > promo.unidades) {
							hashMap[promo.code] = promo;
						}
						return hashMap;
						}, {});

						const finalPromos = Object.values(uniquePromos);
						pino.info(`Cantidad de promos sin repetidos: ${finalPromos.length}`)

						finalPromos.forEach(async element => {
							let verificarExistente = await PromoModel.find({code: `${element.code}`})
							if (verificarExistente.length && element.code) {
								pino.info(`ACTUALIZANDO promo código ${element.code} en la lista ${element.lista}`);
								element.timestamp = Date.now();
								await PromoModel.findOneAndUpdate({code: `${element.code}`}, element)
								return{message:`ya se modificó el promo ${element.code} en la lista ${element.lista}`}
							} else if (element.code) {
								pino.info(`AGREGANDO promo NUEVO con código ${element.code} en la lista ${element.lista}`);
								element.timestamp = Date.now();
								let agregarPromoModel = new PromoModel(element);
								agregarPromoModel.isNew = true
								let agregarPromo = await agregarPromoModel.save();
								// pino.info(agregarPromo);
							}
						});

						return finalPromos
		
					} else {
						let verificarExistente = await PromoModel.find({code: `${promo.code}`})
						if (verificarExistente.length) {
							pino.info(`ya existe un promo con el mismo código ${promo.code}`);
							if (verificarExistente[0].image!="sin_imagen.jpg" && imageName && await exists(__dirname + `/../../../uploads/${verificarExistente[0].image}` )) {
								// let imagePath = path.join(__dirname, `../../../uploads/${verificarExistente[0].image}`)
								await fs.unlink(__dirname + `/../../../uploads/${verificarExistente[0].image}`)	
							}
							if (imageName) {
								promo.image = imageName;
							}
							promo.timestamp = Date.now();
							let updatePromo = await PromoModel.findOneAndUpdate({code: `${promo.code}`}, promo )
							return {message:`ya se modificó el promo ${promo.code}`, resultado:updatePromo}
						} else {
							promo.timestamp = Date.now();
							promo.image = imageName;
							let agregarPromoModel = new PromoModel(promo);
							let agregarPromo = await agregarPromoModel.save();
							pino.info(agregarPromo);
						}
					}
				} catch (error) {
					pino.error(`Se produjo un error: ${error}`)
					throw new Error(error)
				}
			}

			/* Para actualizar listas desde el panel, no agrega nuevos promos */
			async modifyAllCodeNotAdd(promo, imageName) {
				try {
					// let modificar = await PromoModel.findByIdAndUpdate(id, promo);
					// return (modificar)
		
					if (Array.isArray(promo)) {
						promo.forEach(async element => {
							let verificarExistente = await PromoModel.find({code: `${element.code}`, lista: `${element.lista}`})
							if (verificarExistente.length) {
								pino.info(`Actualizando promo código ${element.code} en la lista ${element.lista}`);
								element.timestamp = Date.now();
								await PromoModel.findOneAndUpdate({code: `${element.code}`}, element)
								return{message:`ya se modificó el promo ${element.code} en la lista ${element.lista}`}
							} else {
								pino.info(`NO EXISTE un promo con el código ${element.code} en la lista ${element.lista}`);
								return{message:`NO EXISTE un promo con codigo ${element.code} en la lista ${element.lista}`}
								// element.timestamp = Date.now();
								// let agregarPromoModel = new PromoModel(element);
								// let agregarPromo = await agregarPromoModel.save();
								// pino.info(agregarPromo);
							}
						});
		
					} else {
						return{message:`El elemento no es un Array}`}

						// let verificarExistente = await PromoModel.find({code: `${promo.code}`})
						// if (verificarExistente.length) {
						// 	pino.info(`ya existe un promo con el mismo código ${promo.code}`);
						// 	if (verificarExistente[0].image!="sin_imagen.jpg" && imageName && await exists(__dirname + `/../../../uploads/${verificarExistente[0].image}` )) {
						// 		// let imagePath = path.join(__dirname, `../../../uploads/${verificarExistente[0].image}`)
						// 		await fs.unlink(__dirname + `/../../../uploads/${verificarExistente[0].image}`)	
						// 	}
						// 	if (imageName) {
						// 		promo.image = imageName;
						// 	}
						// 	let updatePromo = await PromoModel.findOneAndUpdate({code: `${promo.code}`}, promo )
						// 	return {message:`ya se modificó el promo ${promo.code}`, resultado:updatePromo}
						// } else {
						// 	promo.timestamp = Date.now();
						// 	promo.image = imageName;
						// 	let agregarPromoModel = new PromoModel(promo);
						// 	let agregarPromo = await agregarPromoModel.save();
						// 	pino.info(agregarPromo);
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
			// 		let mostrar = await PromoModel.aggregate([
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
			// 			PromoModel.remove({
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
			let mostrar = await PromoModel.findById(id);
			return (mostrar)
		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}
	}

	async getAll() {
		try {
			let allPromos = await PromoModel.find({}).sort({name:1});
			return (allPromos)

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}
	}

	async getPromo() {
		try {
			let allPromos = await PromoModel.find({});
			return (allPromos)

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}
	}

	async getByObject(element) {
		try {
			let allPromos = await PromoModel.find(element,"-_id");
			return (allPromos)

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}
	}

	async getAllPage(page,pageSize) {
		try {
			const PAGE_SIZE = pageSize; // Similar a 'límite'
			const skip = (page - 1) * PAGE_SIZE;
			let allPromos = await PromoModel.find({}).skip(skip).limit(PAGE_SIZE);
			let total = await PromoModel.countDocuments({})
			// return (allPromos)
			return ({allPromos: allPromos,total: total})

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}
	}

	async getAllCategory(category) {
		try {
			let allPromos = await PromoModel.find({label: category})
			return (allPromos)

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}
	}

	async getAllCategoryPage(category,page,pageSize) {
		try {
			const PAGE_SIZE = pageSize; // Similar a 'límite'
			const skip = (page - 1) * PAGE_SIZE;
			let allPromos = await PromoModel.find({label: category}).sort({name:1, color:1, code:1}).skip(skip).limit(PAGE_SIZE);
			// let total = await PromoModel.find({label: category}).countDocuments()
			let total = await PromoModel.countDocuments({label: category})
			return ({allPromos: allPromos,total: total})

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}
	}

	async getAllCategoryPageLista(category,page,pageSize,lista) {
		try {
			const PAGE_SIZE = pageSize; // Similar a 'límite'
			const skip = (page - 1) * PAGE_SIZE;
			let allPromos = await PromoModel.find({lista: lista, label: category}).sort({name:1, color:1, code:1}).skip(skip).limit(PAGE_SIZE);
			// let total = await PromoModel.find({label: category}).countDocuments()
			let total = await PromoModel.countDocuments({lista: lista, label: category})
			return ({allPromos: allPromos,total: total})

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}
	}

	async getAllPageLista(category,page,pageSize,lista) {
		try {
			const PAGE_SIZE = pageSize; // Similar a 'límite'
			const skip = (page - 1) * PAGE_SIZE;
			let allPromos = await PromoModel.find({lista: lista}).sort({name:1, color:1, code:1}).skip(skip).limit(PAGE_SIZE);
			// let total = await PromoModel.find({label: category}).countDocuments()
			let total = await PromoModel.countDocuments({lista: lista})
			return ({allPromos: allPromos,total: total})

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}
	}

	async deleteById(id) {
		try {
			// let borrar = await PromoModel.deleteOne({code: `${element.code}`, lista: `${element.lista}`})
			let borrar = await PromoModel.findByIdAndDelete(id);
			return borrar
		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}
	}

	async deleteAll() {
		try {
			const contenido = await PromoModel.deleteMany({});

		} catch (error) {
			throw new Error(error)
		}
	}
}

module.exports = MongoDB;