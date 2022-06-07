const transporter = require('./transport');
const pino = require('../logger/pino');
let adminEmail = `federicous@gmail.com`

class Correo {
	async registro(user) {
		try {
			const option = {
				from: 'Ecommerce - registro',
				to: `${user.email}`,
				bcc: `${adminEmail}`,
				subject: `Usuario Registrado: ${user.username}`,
				text: `El usuario ${user.username} ha sido registrado`
			}
			const response = await transporter.sendMail(option)
			return response
		} catch (error) {
			pino.error(`Tuvimos este error: ${error}`)
		}
	}

	async orden(user, carrito) {
		try {
			let items = ''
			carrito.forEach(e => {
				items += `<li>Producto: ${e.name} | Cantidad: ${e.qty} | Precio: ${e.price}</li><br>`
			})
			const option = {
				from: 'Admin',
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
			return response
		} catch (error) {
			pino.error(`Tuvimos este error: ${error}`)
		}
	}
}

module.exports = new Correo()