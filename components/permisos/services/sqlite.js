const { uuid } = require('uuidv4');
const {sqliteConfig} = require('../../../config/sqlite');
const knex = require('knex')(sqliteConfig);
const pino = require('../../../utils/logger/pino');
let bcrypt = require("bcryptjs");
const JWT = require("../../../utils/jwt/jwt");

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
				table.string('isAdmin')
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


	async getLevel(payload) {
		try {
			let resultado = await knex.from('usuarios').select('*').where({email: payload.email});
			let user = resultado[0];
			if (!user) {
				pino.error(`NO EXISTE EL USUARIO ${payload.email}`);
				return (false)
			} else {
				if (user.isAdmin=="on" || user.isAdmin==true) {
					return(true)
				} 
				return(false)
			}

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
		}
	}

}



module.exports= Contenedor;















