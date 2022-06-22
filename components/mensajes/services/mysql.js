const { uuid } = require('uuidv4');
const {mysqlConfig} = require('../../../config/mysqlDB');
const knex = require('knex')(mysqlConfig);
const pino = require('../../../utils/logger/pino');

(async()=>{
	try {
		let exists= await knex.schema.hasTable('mensajes');
		if (!exists) {
			await knex.schema.createTable('mensajes', table => {
				table.increments('id')
				table.string('email')
				table.string('mensaje')
				table.timestamp('timestamp').defaultTo(knex.fn.now())
				table.uuid('uuid')
				table.rol('rol')
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

	async save(mensaje,id) {
		try {
			if (id) {
				mensaje.id= id;
			}
			mensaje.uuid=uuid()
			let agregar= await knex('mensajes')
			.insert(mensaje)
			pino.info("datos insertados")		

			return mensaje.id

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}		
	}
	
	async modify(mensaje,id) {
		try {
			let modificar = await knex.from('mensajes').select('*').where({id:`${id}`}).update(mensaje);
			return(modificar)


		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}	
	}

	async getById(id) {
		try {
			let idMensaje= parseInt(id);
			let mostrar = await knex.from('mensajes').select('*').where({id:id});
			return(mostrar)


		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}	
	}

	async getAll() {
		try {
			let mostrar = await knex.from('mensajes').select('*');
			pino.info(mostrar);
			return mostrar

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}	
		
	}

	async deleteById(id) {
		try {
			let borrar = await knex.from('mensajes').where({id:`${id}`}).del();


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















