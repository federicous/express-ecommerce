const transporter = require('./transport');
const pino = require('../logger/pino');
require("dotenv").config();
let adminEmail = process.env.NODEMAILER_ADMIN;
let userEmail = process.env.NODEMAILER_USER;
let bccEmail = process.env.NODEMAILER_BCC;

// let dolar = process.env.DOLAR;

function ccyFormat(num) {
	return `${num.toFixed(2)}`;
}

class Correo {
	async registro(user) {
		try {
			const option = {
				from: `BRMTOOLS - Registro de usuario <${userEmail}>`,
				to: `${user.email}`,
				bcc: `${adminEmail},${bccEmail}`,
				subject: `Usuario Registrado: ${user.email} - ${user.name}`,
				text: `El usuario ${user.email} ha sido registrado`,
				html:`
				<style>
	table, th, td {
	  border: 1px solid black;
	  border-collapse: collapse;
	}
	th, td {
	  background-color: white;
	}
	</style>
<table style="vertical-align: top;">
	<thead>
		<tr>
			<td style="min-width: 100px;"></td>
			<td style="text-align: center;min-width: 100px;"><strong>Datos</strong></td>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><strong>Nombre</strong></td>
			<td>${user.name}</td>
		</tr>
		<tr>
			<td><strong>Correo</strong></td>
			<td>${user.email}</td>
		</tr>
		<tr>
			<td><b>Ferreter&iacute;a</b></td>
			<td>${user.ferreteria}</td>
		</tr>
		<tr>
			<td><b>Tel&eacute;fono</b></td>
			<td>${user.phone}</td>
		</tr>
		<tr>
			<td><strong>Direcci&oacute;n</strong></td>
			<td>${user.address}, ${user.provincia}, ${user.localidad}</td>
		</tr>
		<tr>
			<td><strong>CUIT</strong></td>
			<td>${user.cuit}</td>
		</tr>
		<tr>
			<td><strong>Vendedor</strong></td>
			<td>${user.vendedor}</td>
		</tr>
	</tbody>
</table>
				
				
				`
			}
			const response = await transporter.sendMail(option)
			pino.info(`Enviando correo a: ${user.email}`)
			return response
		} catch (error) {
			pino.error(`Tuvimos este error enviando la confirmación de registro: ${error}`)
		}
	}

	async orden(user, carrito, descuento, dolar) {
		try {
			function calcularPrecio(precioConIva,iva,price,usd,qty) {
				/* le saco el iva si viene incluido */
				// let resultado = (precioConIva ? parseFloat(precioConIva)-parseFloat(precioConIva)*(parseFloat(typeof iva === "string" ? iva.replace(/,/g, '.').replace(/%/g, '') : iva))/100 : (price ? `${price}` : usd*dolar))*(qty ? parseFloat(qty) : 1);
				let resultado = (precioConIva ? parseFloat(precioConIva)/(1+(parseFloat(typeof iva === "string" ? iva.replace(/,/g, '.').replace(/%/g, '') : iva))/100) : (price ? `${price}` : usd*dolar))*(qty ? parseFloat(qty) : 1)
				return resultado
			}
			
			let items = ''
			carrito.forEach(item => {
				items += `<tr><td>${
					// [item.name,item.color,item.linea,item.presentacion,`${item.contenido ? (""+item.contenido) : ""}`].filter(Boolean).join(" | ")
					[item.name,item.color,item.linea,item.presentacion,`${(item.unidades!="0" && item.lista=="buloneria bremen") ? (`${item.unidades} unidades`) : ""}`,`${item.contenido ? (""+item.contenido) : ""}`].filter(Boolean).join(" | ")
					}</td> 
					<td style="text-align: center">${item.lista}</td> 
					<td style="text-align: center">${item.code}</td> 
					<td style="text-align: center">${item.qty}</td> 
					<td style="text-align: center">${parseFloat(typeof item.iva === "string" ? item.iva.replace(/,/g, '.').replace(/%/g, '') : item.iva)}%</td> 
					<td style="text-align: center">${ccyFormat(calcularPrecio(item.precioConIva,item.iva,item.price,item.usd))}</td></tr>`
			})
			let suma=0;
			let sumaIva=0;
			let sumaTotal=0;

			if (descuento) {
				for (const item of carrito) {
					let precio = item.price ? item.price : item.usd*dolar
					// suma=parseFloat(item.qty)*parseFloat(precio)+parseFloat(suma)
					suma = calcularPrecio(item.precioConIva,item.iva,item.price,item.usd,item.qty)+parseFloat(suma)
				}			
				for (const item of carrito) {
					// let precio = ccyFormat(item.price ? item.price : item.usd*dolar)
					// sumaIva=ccyFormat((parseFloat(item.qty)*parseFloat(precio)*parseFloat(item.iva)/100)+parseFloat(sumaIva))
	
					let IVA=parseFloat(typeof item.iva === "string" ? item.iva.replace(/,/g, '.').replace(/%/g, '') : item.iva);
					// let PRICE = parseFloat(item.price ? item.price : item.usd*dolar);
					let PRICE = calcularPrecio(item.precioConIva,item.iva,item.price,item.usd)
					let QTY=parseFloat(item.qty);
					sumaIva=parseFloat(QTY*(PRICE-PRICE*(parseFloat(descuento)/100))*IVA/100)+parseFloat(sumaIva);
				}
				sumaTotal = parseFloat(suma+sumaIva)
			} else {
				for (const item of carrito) {
					let precio = item.price ? item.price : item.usd*dolar
					// suma=parseFloat(item.qty)*parseFloat(precio)+parseFloat(suma)
					suma = calcularPrecio(item.precioConIva,item.iva,item.price,item.usd,item.qty)+parseFloat(suma)
				}			
				for (const item of carrito) {
					// let precio = ccyFormat(item.price ? item.price : item.usd*dolar)
					// sumaIva=ccyFormat((parseFloat(item.qty)*parseFloat(precio)*parseFloat(item.iva)/100)+parseFloat(sumaIva))
	
					let IVA=parseFloat(typeof item.iva === "string" ? item.iva.replace(/,/g, '.').replace(/%/g, '') : item.iva);
					// let PRICE = parseFloat(item.price ? item.price : item.usd*dolar);
					let PRICE = calcularPrecio(item.precioConIva,item.iva,item.price,item.usd)
					let QTY=parseFloat(item.qty);
					sumaIva=parseFloat(QTY*PRICE*IVA/100)+parseFloat(sumaIva);
				}
				sumaTotal = parseFloat(suma+sumaIva)
			}


			const option = {
				from: `BRMTOOLS - Orden de compra <${userEmail}>`,
				to: `${user.email}`,
				bcc: `${adminEmail},${bccEmail}`,
				subject: 'Orden creada',
				html: `
					<style>
						table, th, tr, td {
							border: 1px solid black;
							border-collapse: collapse;
						}
					</style>
					<div>
						<p>Su compra ha sido registrada</p>
						<p>Vendedor: ${user.vendedor}</p>
						<p>Cliente: ${user.name} - ${user.email}</p>
						<table>
							<thead>
								<tr>
									<th scope="col">Producto</th>
									<th scope="col">Lista</th>
									<th scope="col">Código</th>
									<th scope="col">Cantidad</th>
									<th scope="col">iva</th>
									<th scope="col">Price</th>
								</tr>
							</thead>
							<tbody id="tablaProductos">
								<tr>
									${items} 
									<tr><td colspan="2" style="text-align: right"><b>Subtotal</b></td><td style="text-align: center">${ccyFormat(suma)}</td></tr>
									<tr><td colspan="2" style="text-align: right"><b>IVA</b></td><td style="text-align: center">${ccyFormat(sumaIva)}</td></tr>
									${descuento?
										`<div>
										<tr><td colspan="2" style="text-align: right"><b>Desc. (${parseFloat(descuento)}%)</td><td style="text-align: center">-${ccyFormat(suma*parseFloat(descuento)/100)}</b></td></tr>
										<tr><td colspan="2" style="text-align: right"><b>TOTAL</b></td><td style="text-align: center">${ccyFormat(sumaTotal-(suma*parseFloat(descuento)/100))}</td></tr>
										</div>`
										:
										`<tr><td colspan="2" style="text-align: right"><b>TOTAL</b></td><td style="text-align: center">${ccyFormat(sumaTotal)}</td></tr>`
									}
								</tr>			 
							</tbody>
						</table>
						<ul>
							<li style="text-align: justify;"><strong>Debido a los constantes cambios de precios de las marcas, es posible que haya modificaciones y correcciones en el pedido. </strong></li>
							<li style="text-align: justify;"><strong>Por favor, aseg&uacute;rese de confirmar la disponibilidad y cantidad de los productos con su vendedor asignado antes de proceder con el pedido.</strong></li>
							<li style="text-align: justify;"><strong> Adem&aacute;s, tenga en cuenta que la aplicaci&oacute;n se encuentra en una etapa de pruebas. </strong><strong>Si encuentra alg&uacute;n error, por favor informe a <a href="mailto:contacto@distribuidorabrmtools.com">contacto@distribuidorabrmtools.com</a>.</strong></li>
						</ul>
					</div>
					`
			}
			const response = await transporter.sendMail(option)
			pino.info(`Enviando correo a: ${user.email}`)
			return response
		} catch (error) {
			pino.error(`Tuvimos este error enviando la orden por correo: ${error}`)
		}
	}
}

module.exports = new Correo()