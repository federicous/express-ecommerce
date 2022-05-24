const { uuid } = require('uuidv4');
const {sqliteConfig} = require('../../../config/SQLite');
const knex = require('knex')(sqliteConfig);
const pino = require('../../../utils/logger/pino');

(async()=>{
	try {
		let exists= await knex.schema.hasTable('usuarios');
		if (!exists) {
			await knex.schema.createTable('usuarios', table => {
				table.increments('id')
				table.string('name')
				table.integer('age')
				table.string('password')
				table.string('address')
				table.string('email')
				table.string('phone')
				table.string('avatar')
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

	async save(usuario,id) {
		try {
			if (id) {
				usuario.id= id;
			}
			usuario.uuid=uuid()
			let agregar= await knex('usuarios')
			.insert(usuario)
			pino.info("datos insertados")		

			return usuario.id

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}		
	}
	
	async modify(id, usuario) {
		try {
			let modificar = await knex.from('usuarios').select('*').where({id:`${id}`}).update(usuario);
			return(modificar)


		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}	
	}

	async getById(id) {
		try {
			let idUser= parseInt(id);
			// let mostrar = await knex.from('usuarios').select('*').where({id:`${id}`});
			let mostrar = await knex.from('usuarios').select('*').where({id:id});
			return(mostrar)


		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}	
	}

	async getAll() {
		try {
			let mostrar = await knex.from('usuarios').select('*');
			pino.info(mostrar);
			return mostrar

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}	
		
	}

	async deleteById(id) {
		try {
			let borrar = await knex.from('usuarios').where({id:`${id}`}).del();


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















