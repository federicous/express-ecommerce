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
				items += `<li>Producto: ${item.name} | Cantidad: ${item.qty} | Precio: ${item.price}</li><br>`
			})
			const option = {
				from: 'Ecommerce - orden <no-reply@ethereal.email>',
				to: `${user.email}`,
				bcc: `${adminEmail}`,
				subject: 'Orden creada',
				html: `
		    <div>
			<p>Su compra ha sido registrada correctamente, detalles:</p>
			<ul>
			   ${items} 
			</ul>
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