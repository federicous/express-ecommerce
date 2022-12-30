let ProductoModel = require('../../../schema/productos')
let productService = require('../../pruducts/services')
let carritosApiService = require('../../carritosApi/services')
const pino = require('../../../utils/logger/pino')
const fs = require('fs')

async function exists(path) {
	try {
		await fs.access(path)
		return true
	} catch {
		return false
	}
}


class MongoDB {

	// async getAll(identificador) {
	// 	try {
	// 		let allProducts = await ProductoModel.find({}).select(`${identificador} -_id`);
	// 		return (allProducts)

	// 	} catch (error) {
	// 		pino.error(`Se produjo un error: ${error}`)
	// 		throw new Error(error)
	// 	}
	// }

	// async getAllLista(identificador,lista) {
	// 	try {
	// 		let allProducts = await ProductoModel.find({lista: `${lista}`}).select(`${identificador} -_id`);
	// 		return (allProducts)

	// 	} catch (error) {
	// 		pino.error(`Se produjo un error: ${error}`)
	// 		throw new Error(error)
	// 	}
	// }

	/* NO USAR LA MODIFICACIÓN DE ESTA MANERA PORQUE GENERA PROBLEMAS, PREFERIBLEMENTE ACTUALIZAR CON LOS PRECIOS DE LA LISTA DIRECTAMENTE */
	async modifyListPrice(lista, categoria, valor) {
		try {
			// let allProducts = await ProductoModel.find({lista: `${lista}`, label: `${categoria}`});
			let allProducts = await ProductoModel.find({
				lista: `${lista}`,
				label: {
					$regex: `^(?i)${categoria}$`
				}
			});
			for (const prod of allProducts) {
				console.log(prod);
				if (prod.price) {
					console.log(parseFloat(prod.price));
					prod.price = parseFloat(prod.price) + parseFloat(prod.price) * (parseFloat(valor) / 100)
					console.log(parseFloat(prod.price));
				}
				if (prod.pricepack) {
					console.log(parseFloat(prod.pricepack));
					prod.pricepack = parseFloat(prod.pricepack) + parseFloat(prod.pricepack) * (parseFloat(valor) / 100)
					console.log(parseFloat(prod.price));
				}
				if (prod.usd) {
					console.log(parseFloat(prod.usd));
					prod.usd = parseFloat(prod.usd) + parseFloat(prod.usd) * (parseFloat(valor) / 100)
					console.log(parseFloat(prod.usd));
				}
				if (prod.pvpusd) {
					console.log(parseFloat(prod.pvpusd));
					prod.pvpusd = parseFloat(prod.pvpusd) + parseFloat(prod.pvpusd) * (parseFloat(valor) / 100)
					console.log(parseFloat(prod.pvpusd));
				}
				await ProductoModel.findOneAndUpdate({
					code: `${prod.code}`,
					lista: `${prod.lista}`
				}, prod)

			}
			return (allProducts)
		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}
	}

	async updateList(listFileName, list, categoria) {
		try {
			if (list == "bremen") {
				var XLSX = require('xlsx');
				var workbook = XLSX.readFile(__dirname + `/../../../uploads/listas/${listFileName}`);
				var sheet_name_list = workbook.SheetNames;
				// console.log(XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]))
	
				let productos = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]])
				let object = {
					code: "Código",
					name: "Producto",
					label: "Categoría",
					unidades: "Cantidad",
					plista: "Precio de Lista",
					pneto: "Precio Neto",
					price: "Precio de Venta",
					piva: "Precio con IVA",
					pvpusd: "PVP",
					origin: "Origen",
					iva: "IVA",
					ucaja: "Unidades  x CAJA",
					ubulto: "Unidades x BULTO",
					description: "Información",
				}
				let newProductos = [];
				for (const item of productos) {
					let newItem = {};
					// newItem.label=`${categoria}`
					for (const k in item) {
						for (const key in object) {
							if (k == object[key]) {
								newItem[key] = `${item[k]}`.replace(/\s+/g, ' ')
								// if (k == object["price"]) {
								// 	newItem[key] = Number(`${item[k]}`)
								// }
								if (k == object["iva"]) {
									newItem[key] = Number(`${item[k]}`)*100
								}
								continue
							}
						}
						
					}
					newItem.lista=`${list}`
					newProductos.push(newItem);
				}
	
				console.log(newProductos);

				/* MODIFICO PRODUCTOS O AGREGO*/
				let response = await productService.modifyAllCode(newProductos);

				/* ACTUALIZO CARRITOS */
				carritosApiService.updateProductList()
				

				return response

			} else if (list == "buloneria bremen") {
				var XLSX = require('xlsx');
				var workbook = XLSX.readFile(__dirname + `/../../../uploads/listas/${listFileName}`);
				var sheet_name_list = workbook.SheetNames;
				// console.log(XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]))
	
				let productos = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]])
				let object = {
					code: "CÓDIGO",
					name: "PRODUCTO",
					label: "CATEGORÍA",
					rosca: "Rosca",
					cabeza: "Cabeza",
					punta: "Punta",
					terminacion: "Terminacion",
					unidades: "Unidades por caja",
					price: "PRECIO DE VENTA",
					iva: "IVA",
				}
				let newProductos = [];
				for (const item of productos) {
					let newItem = {};
					// newItem.label=`${categoria}`
					for (const k in item) {
						for (const key in object) {
							if (k == object[key]) {
								newItem[key] = `${item[k]}`.replace(/\s+/g, ' ').replace(/^-$/g,'')
								if (k == object["iva"]) {
									newItem[key] = Number(`${item[k]}`.replace(/%/g, ''))*100
								}
								continue
							}
						}
						
					}
					newItem.lista=`${list}`
					newProductos.push(newItem);
				}
	
				console.log(newProductos);	

				/* MODIFICO PRODUCTOS O AGREGO*/
				let response = await productService.modifyAllCodeNotAdd(newProductos);

				/* ACTUALIZO CARRITOS */
				carritosApiService.updateProductList()

				return newProductos
				
			} else if (list == "kanton") {
				// return
				var XLSX = require('xlsx');
				var workbook = XLSX.readFile(__dirname + `/../../../uploads/listas/${listFileName}`);
				var sheet_name_list = workbook.SheetNames;
				// console.log(XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]))
	
				let productos = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]])
				// console.log(productos);
				// return
				let object = {
					code: "Código Nacional",
					// name: "Descripción",
					// unidades: "Cantidad",
					price: "Precio\nOFERTA Unit",
					pricepack: "Precio  \nOFERTA x Pack "
					// ucaja: "Unidades  x CAJA",
					// ubulto: "Unidades x BULTO",
					// description: "Información",
				}
				let newProductos = [];
				for (const item of productos) {
					let newItem = {};
					// newItem.label=`${categoria}`
					for (const k in item) {
						for (const key in object) {
							if (k == object[key]) {
								newItem[key] = `${item[k]}`.replace(/\s+/g, ' ')

								if (k == object["iva"]) {
									newItem[key] = `${item[k]}`.replace(/%/g, '')
								}
								continue
							}
						}
						
					}
					newItem.lista=`${list}`
					// let secondItem= {...newItem};
					// secondItem["code"]=secondItem["code"]+"-12"
					// secondItem["price"]=secondItem["pricepack"]
					// secondItem["unidades"]="12 unidades"
					newProductos.push(newItem);
					// newProductos.push(secondItem)
				}
	
				console.log(newProductos);

				/* MODIFICO PRODUCTOS */
				let response = await productService.modifyAllCodeNotAdd(newProductos);

				/* traigo productos actualizados */
				// let productosPack = [];
				// for (const item of newProductos) {
				// 	let itemResponse = await productService.getByObject({code:`${item["code"]}`, lista:`${list}`})
				// 	let secondItem= itemResponse[0];
				// 	secondItem["code"]=secondItem["code"]+"P"
				// 	secondItem["price"]=secondItem["pricepack"]
				// 	secondItem["name"]=secondItem["name"]+" (Pack 12 unidades) "
				// 	productosPack.push(secondItem)
				// }

				let productosPack = [];
				await Promise.all(newProductos.map( async item => {
					let itemResponse = await productService.getByObject({code:`${item["code"]}`, lista:`${list}`})
					let secondItem= itemResponse[0];
					secondItem["code"]=secondItem["code"]+"P"
					secondItem["price"]=secondItem["pricepack"]
					secondItem["name"]=secondItem["name"]+" (Pack 12 unidades) "
					productosPack.push(secondItem)
				}))


				console.log(productosPack);
				console.log(`################## Agregar packs`);
				await productService.modifyAllCodeNotAdd(productosPack);

				/* ACTUALIZO CARRITOS */
				console.log(`################# Actualizar carritos`);
				await carritosApiService.updateProductList()
				console.log(`##################  Final kanton`);				
				return newProductos

			} else if (list == "tekbond") {
				var XLSX = require('xlsx');
				var workbook = XLSX.readFile(__dirname + `/../../../uploads/listas/${listFileName}`);
				var sheet_name_list = workbook.SheetNames;
				// console.log(XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]))
	
				let productos = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]])
				let object = {
					code: "Codigo",
					codigobarra : "Cod.Barra PC",
					linea: "Linea",
					contenido: "Cont (gr)",
					presentacion: "Present.",
					color: "Color",
					unidades: "Un x Caja",
					usd: "PRECIO USD",
					price: "Precio de Venta",
					pvpusd: "PVP***",
				}
				let newProductos = [];
				for (const item of productos) {
					let newItem = {};
					newItem.label=`${categoria}`
					for (const k in item) {
						for (const key in object) {
							if (k == object[key]) {
								newItem[key] = `${item[k]}`.replace(/\s+/g, ' ')
								if (k == object["code"] && `${item[k]}`.length > 6 ) {
									newItem[key] = `${item[k]}`.slice(5)
								}
								continue
							}
						}
						
					}
					newItem.lista=`${list}`
					newProductos.push(newItem);
				}
	
				console.log(newProductos);

				/* MODIFICO PRODUCTOS */
				let response = await productService.modifyAllCodeNotAdd(newProductos);

				/* ACTUALIZO CARRITOS */
				carritosApiService.updateProductList()
				
				return newProductos
			}

			// const array = require(__dirname + `/../../../uploads/lista/${listFileName}`)

			var XLSX = require('xlsx');
			var workbook = XLSX.readFile(__dirname + `/../../../uploads/listas/${listFileName}`);
			var sheet_name_list = workbook.SheetNames;
			// console.log(XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]))

			let productos = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]])
			let object = {
				code: "Código",
				name: "Producto",
				label: "Categoría",
				unidades: "Cantidad",
				plista: "Precio de Lista",
				pneto: "Precio Neto",
				price: "Precio de Venta",
				piva: "Precio con IVA",
				pvpusd: "PVP",
				origin: "Origen",
				iva: "IVA",
				ucaja: "Unidades  x CAJA",
				ubulto: "Unidades x BULTO",
				description: "Información",
			}
			let newProductos = [];
			for (const item of productos) {
				let newItem = {};
				newItem.label=`${categoria}`
				for (const k in item) {
					for (const key in object) {
						if (k == object[key]) {
							newItem[key] = `${item[k]}`.replace(/\s+/g, ' ')
							continue
						}
					}
					
				}
				newItem.lista=`${list}`
				newProductos.push(newItem);
			}

			console.log(newProductos);
			return newProductos

			// let modificar = await ProductoModel.findByIdAndUpdate(id, producto);
			// return (modificar)

			if (Array.isArray(producto)) {
				producto.forEach(async element => {
					let verificarExistente = await ProductoModel.find({
						code: `${element.code}`
					})
					if (verificarExistente.length) {
						pino.info(`ya existe un producto con el mismo código ${element.code} en la lista ${element.lista}`);
						await ProductoModel.findOneAndUpdate({
							code: `${element.code}`
						}, element)
						return {
							message: `ya se modificó el producto ${element.code} en la lista ${element.lista}`
						}
					} else {
						element.timestamp = Date.now();
						let agregarProductoModel = new ProductoModel(element);
						let agregarProducto = await agregarProductoModel.save();
						pino.info(agregarProducto);
					}
				});

			} else {
				let verificarExistente = await ProductoModel.find({
					code: `${producto.code}`
				})
				if (verificarExistente.length) {
					pino.info(`ya existe un producto con el mismo código ${producto.code}`);
					if (verificarExistente[0].image != "sin_imagen.jpg" && imageName && await exists(__dirname + `/../../../uploads/${verificarExistente[0].image}`)) {
						// let imagePath = path.join(__dirname, `../../../uploads/${verificarExistente[0].image}`)
						await fs.unlink(__dirname + `/../../../uploads/${verificarExistente[0].image}`)
					}
					if (imageName) {
						producto.image = imageName;
					}
					let updateProduct = await ProductoModel.findOneAndUpdate({
						code: `${producto.code}`
					}, producto)
					return {
						message: `ya se modificó el producto ${producto.code}`,
						resultado: updateProduct
					}
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

}

module.exports = MongoDB;