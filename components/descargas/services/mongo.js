let UsuarioModel = require('../../../schema/usuarios');
let bcrypt = require("bcryptjs");
const JWT = require("../../../utils/jwt/jwt");
const pino = require('../../../utils/logger/pino');

class AuthService {
	async updateList(listFileName, list, categoria) {
		try {
			pino.info(`################### ACTUALIZANDO LISTA ${list} ###################`);
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
				/* Verificación de campos para evitar error de lista */
				const camposObligatorios = ["Código","Producto","Categoría","Cantidad","Precio de Venta","IVA",]
				const comparar = []
				for (const key in productos[0]) {
					comparar.push(key)
				}
				const contieneTodos = camposObligatorios.every(elemento => comparar.includes(elemento));				
				if (!contieneTodos) {
					pino.info(`Lista equivocada, debe ingresar la de BREMEN Gral`)
					return {result:"error"}
				}
				/* FIN Verificación */
				
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
				pino.info(newProductos);

				/* MODIFICO PRODUCTOS O AGREGO*/
				// let response = await productService.modifyAllCode(newProductos);
				let response = await productService.modifyAllCodeRepeated(newProductos);

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

				/* Verificación de campos para evitar error de lista */
				const camposObligatorios = ["CÓDIGO","PRODUCTO","CATEGORÍA","Rosca","Cabeza","Punta","Terminacion","Unidades por caja","PRECIO DE VENTA","IVA"]
				const comparar = []
				for (const key in productos[0]) {
					comparar.push(`${key}`)
				}
				console.log(camposObligatorios);
				const contieneTodos = camposObligatorios.every(elemento => comparar.includes(elemento));				
				if (!contieneTodos) {
					pino.info(`Lista equivocada, debe ingresar la de BULONERIA BREMEN`)
					return {result:"error"}
				}
				/* FIN Verificación */

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
	
				pino.info(newProductos);	

				/* MODIFICO PRODUCTOS O AGREGO*/
				// let response = await productService.modifyAllCodeNotAdd(newProductos);
				let response = await productService.modifyAllCodeRepeated(newProductos);

				/* ACTUALIZO CARRITOS */
				carritosApiService.updateProductList()

				return response
				
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
					precioConIva: "Precio\nOFERTA Unit",
					pricepack: "Precio  \nOFERTA x Pack "
					// ucaja: "Unidades  x CAJA",
					// ubulto: "Unidades x BULTO",
					// description: "Información",
				}

				/* Verificación de campos para evitar error de lista */
				const camposObligatorios = ["Código Nacional","Precio\nOFERTA Unit","Precio  \nOFERTA x Pack "]
				const comparar = []
				for (const key in productos[0]) {
					comparar.push(`${key}`)
				}
				console.log(camposObligatorios);
				const contieneTodos = camposObligatorios.every(elemento => comparar.includes(elemento));				
				if (!contieneTodos) {
					pino.info(`Lista equivocada, debe ingresar la de KANTON`)
					return {result:"error"}
				}
				/* FIN Verificación */

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
	
				pino.info(newProductos);

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

				/* Armo los packs */
				let productosPack = [];
				await Promise.all(newProductos.map( async item => {
					let itemResponse = await productService.getByObject({code:`${item["code"]}`, lista:`${list}`})
					let secondItem= itemResponse[0];
					secondItem["code"]=secondItem["code"]+"P"
					secondItem["price"]=secondItem["pricepack"]
					secondItem["precioConIva"]=secondItem["pricepack"]
					secondItem["name"]=secondItem["name"]+" (Pack 12 unidades) "
					productosPack.push(secondItem)
				}))


				pino.info(productosPack);
				pino.info(`################## Agregar packs`);
				await productService.modifyAllCodeNotAdd(productosPack);

				/* ACTUALIZO CARRITOS */
				pino.info(`################# Actualizar carritos`);
				await carritosApiService.updateProductList()
				pino.info(`##################  Final kanton`);				
				return newProductos

			} else if (list == "tekbond") {
				/* quito los acentos y pongo en minúscula para comparar, el nombre de la lista no debe contener acentos */
				let nombreLista=decodeURIComponent(encodeURIComponent(`${listFileName}`.replace(/^\w+-\w+-\w+-/,"").replace(/\.\w+$/,""))).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
				let nombreCategoria=categoria.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
				if (nombreLista!=nombreCategoria) {
					pino.info("El nombre de la lista no es el mismo que la categoría");					
					pino.info(`Nombre de la categoría: ${nombreCategoria}`);
					pino.info(`Nombre de la lista: ${nombreLista}`);
					return
				}
				pino.info(`Nombre de la categoría: ${nombreCategoria}`);
				pino.info(`Nombre de la lista: ${nombreLista}`);
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

				/* Verificación de campos para evitar error de lista */
				const camposObligatorios = ["Codigo","Cod.Barra PC","Linea","Cont (gr)","Color","Un x Caja","PRECIO USD"]
				const comparar = []
				for (const key in productos[0]) {
					comparar.push(`${key}`)
				}
				console.log(camposObligatorios);
				console.log(comparar);
				const contieneTodos = camposObligatorios.every(elemento => comparar.includes(elemento));				
				if (!contieneTodos) {
					pino.info(`Lista equivocada, debe ingresar la de TEKBOND`)
					return {result:"error"}
				}
				/* FIN Verificación */

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
	
				// pino.info(newProductos);

				/* MODIFICO PRODUCTOS */
				// let response = await productService.modifyAllCodeNotAdd(newProductos);
				let response = await productService.modifyAllCodeRepeated(newProductos);


				/* ACTUALIZO CARRITOS */
				carritosApiService.updateProductList()
				
				return newProductos
			} else if (list == "sinpar") {
				var XLSX = require('xlsx');
				var workbook = XLSX.readFile(__dirname + `/../../../uploads/listas/${listFileName}`);
				var sheet_name_list = workbook.SheetNames;
				// console.log(XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]))
	
				let productos = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]])
				let object = {
					code: "CODIGO",
					name: "PRODUCTO",
					price: "PRECIO SIN IVA",
					iva: "IVA",
					ofertaUno: "OFERTA I",
					ofertaDos: "OFERTA II",
					ventaMinima: "VENTA MINIMA",
					label: "CATEGORIA",
				}
				/* Verificación de campos para evitar error de lista */
				const camposObligatorios = ["CODIGO","PRODUCTO","PRECIO SIN IVA","IVA","VENTA MINIMA"]
				const comparar = []
				for (const key in productos[0]) {
					comparar.push(`${key}`.trim())
				}
				console.log(comparar);
				const contieneTodos = camposObligatorios.every(elemento => comparar.includes(elemento));				
				if (!contieneTodos) {
					pino.info(`Lista equivocada, debe ingresar la de ${list}`)
					return {result:"error"}
				}
				/* FIN Verificación */
				
				let newProductos = [];
				for (const item of productos) {
					let newItem = {};
					for (const k in item) {
						for (const key in object) {
							if (k.trim() == object[key.trim()]) {
								newItem[key.trim()] = `${item[k]}`.replace(/\s+/g, ' ')
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
				pino.info(newProductos);

				/* MODIFICO PRODUCTOS O AGREGO*/
				// let response = await productService.modifyAllCode(newProductos);
				let response = await productService.modifyAllCodeRepeated(newProductos);

				/* ACTUALIZO CARRITOS */
				carritosApiService.updateProductList()

				return response
			}

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}
	}
	
}

module.exports = AuthService;