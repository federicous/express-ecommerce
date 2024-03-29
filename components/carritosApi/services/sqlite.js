const {	sqliteConfig } = require('../../../config/sqlite');
const knex = require('knex')(sqliteConfig);
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
		pino.error(`Se produjo un error cart: ${error}`)
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
			let busquedaCart = await knex.from('carritos').select('*').where({email: carrito.email});
			let cart = busquedaCart[0];
			if (cart) {
				return (cart.id)
			}
			let nuevoCarrito = {};
			nuevoCarrito.uuid = v4();
			nuevoCarrito.email = carrito.email;
			nuevoCarrito.address = carrito.address;
			nuevoCarrito.productList = JSON.stringify([])
			let agregar = await knex('carritos')
				.insert(nuevoCarrito)
			pino.info("datos insertados")
			let carritoGuardado = await knex.from('carritos').select('*').where({email: carrito.email});
			// pino.info(`Nuevo carrito id: ${cart.id}`)
			pino.info(`Nuevo carrito id: ${carritoGuardado[0].id}`)
			return carritoGuardado[0].id

		} catch (error) {
			pino.error(`Se produjo un error cart save: ${error}`)
			
		}
	}

	async saveSubElement(id, subElement) {
		try {
			let resultado = await knex.from('carritos').select('*').where({id: `${id}`});
			let carrito = resultado[0]
			let productlistParsed = JSON.parse(carrito.productList);
			let nuevaProductList = productlistParsed.filter((item) => item.id !== `${subElement.id}`);
			nuevaProductList.push(subElement)
			carrito.productList = JSON.stringify(nuevaProductList)
			await knex.from('carritos').select('*').where({id: `${id}`}).update(carrito);
			return (carrito)

		} catch (error) {
			pino.error(`Se produjo un error cart saveSubElement: ${error}`)
			
		}
	}

	async saveSubElementReact(id, subElement) {
		try {
			// Si es array simplemente sobreescribo el carrito
			if (Array.isArray(subElement)) {
				let resultado = await knex.from('carritos').select('*').where({id: `${id}`});
				let carrito = resultado[0]
				carrito.productList= JSON.stringify(subElement);
				await knex.from('carritos').select('*').where({id: `${id}`}).update(carrito);
				return (carrito)
			} else {
				let resultado = await knex.from('carritos').select('*').where({id: `${id}`});
				let carrito = resultado[0]
				let productlistParsed = JSON.parse(carrito.productList);
				let nuevaProductList = productlistParsed.filter((item) => item.id !== `${subElement.id}`);
				nuevaProductList.push(subElement)
				carrito.productList = JSON.stringify(nuevaProductList)
				await knex.from('carritos').select('*').where({id: `${id}`}).update(carrito);
				return (carrito)
			}	
		} catch (error) {
			pino.error(`Se produjo un error cart saveSubElementReact: ${error}`)
			
		}
	}

	async modify(id, carrito) {
		try {
			let modificar = await knex.from('carritos').select('*').where({id: `${id}`}).update(carrito);
			return (modificar)

		} catch (error) {
			pino.error(`Se produjo un error cart modify: ${error}`)
			
		}
	}

	async getById(id) {
		try {
			let idCarrito = parseInt(id);
			let mostrar = await knex.from('carritos').select('*').where({id: id});
			return (mostrar[0])


		} catch (error) {
			pino.error(`Se produjo un error cart getById: ${error}`)
			
		}
	}

	async getSubElementsById(id) {
		try {
			let carrito = await knex.from('carritos').select('*').where({id: id});
			return (JSON.parse(carrito[0].productList))


		} catch (error) {
			pino.error(`Se produjo un error cart getSubElementsById: ${error}`)
			
		}
	}

	async getAll() {
		try {
			let mostrar = await knex.from('carritos').select('*');
			return mostrar

		} catch (error) {
			pino.error(`Se produjo un error cart getAll: ${error}`)
			
		}

	}

	async deleteById(id) {
		try {
			let borrar = await knex.from('carritos').where({id: `${id}`}).del();

		} catch (error) {
			pino.error(`Se produjo un error cart deleteById: ${error}`)
			
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
			pino.error(`Se produjo un error cart deleteSubElementById: ${error}`)
			
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