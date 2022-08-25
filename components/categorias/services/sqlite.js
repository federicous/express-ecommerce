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
		pino.error(`Se produjo un error sqlite categorias: ${error}`)
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

	async getAll(identificador) {
		try {
			let mostrar = await knex.from('productos').select('*');
			return mostrar

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}	
		
	}

	async getAllLista(identificador,lista) {
		try {
			// let mostrar = await knex.from('productos').select('*').where({lista:`${lista}`});
			let mostrar = await knex.from('productos').select(`${identificador}`).where({lista:`${lista}`});
			return mostrar

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}	
		
	}

}



module.exports= Contenedor;















