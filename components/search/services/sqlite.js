const { uuid } = require('uuidv4');
const {sqliteConfig} = require('../../../config/sqlite');
const knex = require('knex')(sqliteConfig);
const pino = require('../../../utils/logger/pino');

(async()=>{
	try {
		let exists= await knex.schema.hasTable('productos');
		if (!exists) {
			await knex.schema.createTable('productos', table => {
				table.increments('id')
				table.string('name')
				table.string('code')
				table.string('label')
				table.string('origin')
				table.string('iva')
				table.integer('stock')
				table.float('price')
				table.string('description')
				table.string('image')
				table.timestamp('timestamp').defaultTo(knex.fn.now())
				table.uuid('uuid')
			});	  
		} else {
			pino.info("ya existe la tabla");
		}
      	} catch (error){
		pino.error(`Se produjo un error: ${error}`)
	}
})();

class Contenedor {

	constructor(mysqlConfig) {
		this.contador=1;
		// Singleton:
		if (typeof Contenedor.instance === "object") {
			return Contenedor.instance;
		}
		Contenedor.instance= this;
		return this;
	}

	async getAllNamesPage(patron = "a",page,pageSize) {
		try {
			const PAGE_SIZE = pageSize; // Similar a 'límite'
			const skip = (page - 1) * PAGE_SIZE;
			let allProducts = await knex.from('productos')
			.select('*')
			.where('name', 'like', `${patron}%`)
			.orWhere('name', 'like', `% ${patron}%`)
			.orWhere('code', 'like', `${patron}%`)
			.orWhere('label', 'like', `${patron}%`)
			.orWhere('linea', 'like', `${patron}%`)
			.orWhere('color', 'like', `${patron}%`)
			.offset(`${skip}`)
			.limit(`${PAGE_SIZE}`);
			// let total = await knex.from('productos').select('*').where({label:`${category}`}).count('*')
			let todos= await knex.from('productos')
			.select('*')
			.where('name', 'like', `${patron}%`)
			.orWhere('name', 'like', `% ${patron}%`)
			.orWhere('code', 'like', `${patron}%`)
			.orWhere('label', 'like', `${patron}%`)
			.orWhere('linea', 'like', `${patron}%`)
			.orWhere('color', 'like', `${patron}%`)
			let total = todos.length
			return ({allProducts: allProducts,total: total})

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}
	}

	async getAllPage(page,pageSize) {
		try {
			const PAGE_SIZE = pageSize; // Similar a 'límite'
			const skip = (page - 1) * PAGE_SIZE;
			let allProducts = await knex.from('productos')
			.select('*')
			.offset(`${skip}`)
			.limit(`${PAGE_SIZE}`);
			let todos= await knex.from('productos')
			.select('*')
			// console.log(todos);
			let total = todos.length
			return ({allProducts: allProducts,total: total})

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}
	}


}



module.exports= Contenedor;















