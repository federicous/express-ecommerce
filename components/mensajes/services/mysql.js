const { uuid } = require('uuidv4');
const {mysqlConfig} = require('../../../config/mysqlDB');
const knex = require('knex')(mysqlConfig);
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
		pino.error(`Se produjo un error: ${error}`)
	}
})();

class Contenedor {

	constructor(mysqlConfig) {
		this.contador=1;
		// this.knex = require('knex')(mysqlConfig);
		// Singleton:
		if (typeof Contenedor.instance === "object") {
			return Contenedor.instance;
		}
		Contenedor.instance= this;
		return this;
	}

	async save(producto,id) {
		try {
			if (id) {
				producto.id= id;
			}
			producto.uuid=uuid()
			let agregar= await knex('productos')
			.insert(producto)
			pino.info("datos insertados")		

			return producto.id

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}		
	}
	
	async modify(producto,id) {
		try {
			let modificar = await knex.from('productos').select('*').where({id:`${id}`}).update(producto);
			return(modificar)


		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}	
	}

	async getById(id) {
		try {
			let idProduct= parseInt(id);
			// let mostrar = await knex.from('productos').select('*').where({id:`${id}`});
			let mostrar = await knex.from('productos').select('*').where({id:id});
			return(mostrar)


		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}	
	}

	async getAll() {
		try {
			let mostrar = await knex.from('productos').select('*');
			pino.info(mostrar);
			return mostrar

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}	
		
	}

	async deleteById(id) {
		try {
			let borrar = await knex.from('productos').where({id:`${id}`}).del();


		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}		
	}

	async deleteAll() {
		try {
			const contenido = await fs.promises.writeFile(this.url,[])

		} catch (error) {
			throw new Error(error)
		}


	}
}



module.exports= Contenedor;















