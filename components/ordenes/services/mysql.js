const {	mysqlConfig } = require('../../../config/mysqlDB');
const knex = require('knex')(mysqlConfig);
const {
	v4
} = require('uuid');
const pino = require('../../../utils/logger/pino');

(async () => {
	try {
		let exists = await knex.schema.hasTable('ordenes');
		if (!exists) {
			await knex.schema.createTable('ordenes', table => {
				table.increments('id')
				table.string('email')
				table.string('state')
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

	async save(orden) {
		try {
			orden.uuid = v4();
			orden.email = orden.email;
			orden.address = orden.address;
			orden.productList = JSON.stringify([])
			let agregar = await knex('ordenes')
				.insert(orden)
			pino.info("datos insertados")

			return orden.id

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			
		}
	}

	async modify(id, orden) {
		try {
			let modificar = await knex.from('ordenes').select('*').where({id: `${id}`}).update(orden);
			return (modificar)

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			
		}
	}

	async getById(id) {
		try {
			let idOrden = parseInt(id);
			let mostrar = await knex.from('ordenes').select('*').where({id: id});
			return (mostrar)


		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			
		}
	}

	async getAll() {
		try {
			let mostrar = await knex.from('ordenes').select('*');
			pino.info(mostrar);
			return mostrar

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			
		}

	}

	async deleteById(id) {
		try {
			let borrar = await knex.from('ordenes').where({id: `${id}`}).del();

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