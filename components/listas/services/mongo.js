let ProductoModel = require('../../../schema/productos')
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

	async updateList(listFileName) {
		try {

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
				for (const k in item) {
					for (const key in object) {
						if (k == object[key]) {
							newItem[key] = `${item[k]}`.replace(/\s+/g, ' ')
							continue
						}
					}
				}
				newProductos.push(newItem);
			}

			console.log(newProductos);
			return

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