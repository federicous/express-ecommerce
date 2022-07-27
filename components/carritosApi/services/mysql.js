const {	mysqlConfig } = require('../../../config/mysql');
const knex = require('knex')(mysqlConfig);
const {
	v4
} = require('uuid');
const pino = require('../../../utils/logger/pino');

(async () => {
	try {
		let exists = await knex.schema.hasTable('carritos');
		if (!exists) {
			await knex.schema.createTable('carritos', table => {
				table.increments('id')
				table.string('email')
				table.string('address')
				table.string('productList')
				table.timestamp('timestamp').defaultTo(knex.fn.now())
				table.uuid('uuid')
			});
		} else {
			pino.info("ya existe la tabla");
		}
	} catch (error) {
		pino.error(`Se produjo un error: ${error}`)
	}
})();

class Contenedor {

	constructor(mysqlConfig) {
		this.contador = 1;
		// Singleton:
		if (typeof Contenedor.instance === "object") {
			return Contenedor.instance;
		}
		Contenedor.instance = this;
		return this;
	}

	async save(carrito) {
		try {
			carrito.uuid = v4();
			carrito.email = carrito.email;
			carrito.address = carrito.address;
			carrito.productList = JSON.stringify([])
			let agregar = await knex('carritos')
				.insert(carrito)
			pino.info("datos insertados")

			return carrito.id

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			
		}
	}

	async saveSubElement(id, subElement) {
		try {

			let resultado = await knex.from('carritos').select('*').where({id: `${id}`});
			let carrito = resultado[0]
			let nuevaLista = JSON.parse(carrito.productList);
			nuevaLista.push(subElement)
			carrito.productList = JSON.stringify(nuevaLista)
			await knex.from('carritos').select('*').where({id: `${id}`}).update(carrito);
			return (carrito)

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			
		}
	}

	async modify(id, carrito) {
		try {
			let modificar = await knex.from('carritos').select('*').where({id: `${id}`}).update(carrito);
			return (modificar)

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			
		}
	}

	async getById(id) {
		try {
			let idCarrito = parseInt(id);
			let mostrar = await knex.from('carritos').select('*').where({id: id});
			return (mostrar)


		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			
		}
	}

	async getSubElementsById(id) {
		try {
			let carrito = await knex.from('carritos').select('*').where({id: id});
			return (carrito[0].productList)


		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			
		}
	}

	async getAll() {
		try {
			let mostrar = await knex.from('carritos').select('*');
			pino.info(mostrar);
			return mostrar

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			
		}

	}

	async deleteById(id) {
		try {
			let borrar = await knex.from('carritos').where({id: `${id}`}).del();

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			
		}
	}

	async deleteSubElementById(id, id_prod) {
		try {
			let resultado = await knex.from('carritos').select('*').where({id: `${id}`});
			let carrito = resultado[0]
			let carritoLista = JSON.parse(carrito.productList);
			let nuevaProductList = carritoLista.filter((item) => item.id !== `${id_prod}`);
			carrito.productList = JSON.stringify(nuevaProductList)
			await knex.from('carritos').select('*').where({id: `${id}`}).update(carrito);
			return (nuevaProductList)

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			
		}
	}

	async deleteAll() {
		try {
			const contenido = await fs.promises.writeFile(this.url, [])

		} catch (error) {
			
		}


	}
}



module.exports = Contenedor;