const transporter = require('./transport');
const pino = require('../logger/pino');
require("dotenv").config();
let adminEmail = process.env.NODEMAILER_ADMIN;

class Correo {
	async registro(user) {
		try {
			const option = {
				from: 'Ecommerce - registro <no-reply@ethereal.email>',
				to: `${user.email}`,
				bcc: `${adminEmail}`,
				subject: `Usuario Registrado: ${user.email}`,
				text: `El usuario ${user.email} ha sido registrado`
			}
			const response = await transporter.sendMail(option)
			pino.info(`Enviando correo a: ${user.email}`)
			return response
		} catch (error) {
			pino.error(`Tuvimos este error: ${error}`)
		}
	}

	async orden(user, carrito) {
		try {
			let items = ''
			carrito.forEach(item => {
				items += `<tr><td>${item.name} </td> <td>${item.qty}</td> <td>${item.price}<td></tr>`
			})
			const option = {
				from: 'Ecommerce - orden <no-reply@ethereal.email>',
				to: `${user.email}`,
				bcc: `${adminEmail}`,
				subject: 'Orden creada',
				html: `
					<div>
					<p>Su compra ha sido registrada correctamente, detalles:</p>
						<table>
							<thead>
								<tr>
									<th scope="col">Producto</th>
									<th scope="col">Cantidad</th>
									<th scope="col">Price</th>
								</tr>
							</thead>
							<tbody id="tablaProductos">
								<tr>
									${items} 
								</tr>			 
							</tbody>
						</table>
					</div>
					`
			}
			const response = await transporter.sendMail(option)
			pino.info(`Enviando correo a: ${user.email}`)
			return response
		} catch (error) {
			pino.error(`Tuvimos este error: ${error}`)
		}
	}
}

module.exports = new Correo()