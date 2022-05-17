const {	mysqlConfig } = require('../../../config/mysqlDB');
const knex = require('knex')(mysqlConfig);
const {
	v4
} = require('uuid');

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
			console.log("ya existe la tabla");
		}
	} catch (error) {
		console.log(error);
	}
})();

class Contenedor {

	constructor(mysqlConfig) {
		this.contador = 1;
		// this.knex = require('knex')(mysqlConfig);
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
			console.log("datos insertados")

			return carrito.id

		} catch (error) {
			console.log(`Error de lectura`, error);
			throw new Error(error)
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
			console.log(`Error de lectura`, error);
			throw new Error(error)
		}
	}

	async modify(id, carrito) {
		try {
			let modificar = await knex.from('carritos').select('*').where({id: `${id}`}).update(carrito);
			return (modificar)

		} catch (error) {
			console.log(`Error de lectura`, error);
			throw new Error(error)
		}
	}

	async getById(id) {
		try {
			let idCarrito = parseInt(id);
			// let mostrar = await knex.from('carritos').select('*').where({id:`${id}`});
			let mostrar = await knex.from('carritos').select('*').where({id: id});
			return (mostrar)


		} catch (error) {
			console.log(`Error de lectura`, error);
			throw new Error(error)
		}
	}

	async getSubElementsById(id) {
		try {
			// let idCarrito = parseInt(id);
			// let mostrar = await knex.from('carritos').select('*').where({id:`${id}`});
			let carrito = await knex.from('carritos').select('*').where({id: id});
			return (carrito[0].productList)


		} catch (error) {
			console.log(`Error de lectura`, error);
			throw new Error(error)
		}
	}

	async getAll() {
		try {
			let mostrar = await knex.from('carritos').select('*');
			console.log(mostrar);
			return mostrar

		} catch (error) {
			console.log(`Error de lectura`, error);
			throw new Error(error)
		}

	}

	async deleteById(id) {
		try {
			let borrar = await knex.from('carritos').where({id: `${id}`}).del();

		} catch (error) {
			console.log(`Error de lectura`, error);
			throw new Error(error)
		}
	}

	async deleteSubElementById(id, id_prod) {
		try {
			// let borrar = await knex.from('carritos').where({id: `${id}`}).del();

			let resultado = await knex.from('carritos').select('*').where({id: `${id}`});
			let carrito = resultado[0]
			let carritoLista = JSON.parse(carrito.productList);
			let nuevaProductList = carritoLista.filter((item) => item.id !== `${id_prod}`);
			carrito.productList = JSON.stringify(nuevaProductList)
			await knex.from('carritos').select('*').where({id: `${id}`}).update(carrito);
			return (nuevaProductList)


			// let nuevaProductList = carritoLista.filter((item) => item.id !== `${id_prod}`);
			carritoActualizado.productList = nuevaProductList;

		} catch (error) {
			console.log(`Error de lectura`, error);
			throw new Error(error)
		}
	}

	async deleteAll() {
		try {
			const contenido = await fs.promises.writeFile(this.url, [])

		} catch (error) {
			throw new Error(error)
		}


	}
}



module.exports = Contenedor;