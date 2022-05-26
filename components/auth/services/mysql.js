const { uuid } = require('uuidv4');
const {mysqlConfig} = require('../../../config/mysqlDB');
const knex = require('knex')(mysqlConfig);
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
		// this.knex = require('knex')(mysqlConfig);
		// Singleton:
		if (typeof Contenedor.instance === "object") {
			return Contenedor.instance;
		}
		Contenedor.instance= this;
		return this;
	}

	async createUser(usuario) {
		try {
			let resultado = await knex.from('usuarios').select('*').where({email: usuario.email});
			let user=resultado[0]
			pino.info(usuario);
			pino.info(user);

			if (user.email) {
				return ({message: 'Ya existe una cuenta con el mismo email'})
			}
			const passwordHash = bcrypt.hashSync(usuario.password, 10)
			usuario.password = passwordHash;
			usuario.uuid=uuid()
			let agregar= await knex('usuarios')
			.insert(usuario)
			pino.info("datos insertados")	
			return usuario.id

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
		}		
	}

	async login(email, password) {
		try {
			let resultado = await knex.from('usuarios').select('*').where({email: email});
			let user = resultado[0];
			if (!user) {
				pino.error(`NO EXISTE EL USUARIO ${email}`);
				return ({
					message: 'No existe el usuario'
				})
			} else if (bcrypt.compareSync(password, user.password)) {
				let ID = user._id ? user._id : user.id;
				const token = await JWT.generate({
					id: ID,
					name: user.name,
					email: user.email,
					isAdmin: user.isAdmin,
				})
				return ({
					email: user.email,
					token
				})
			} else {
				pino.error(`CONTRASEÑA INCORRECTA: ${password} PARA USUARIO: ${email}`);
				return ({
					message: 'contraseña incorrecta'
				})
			}
		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
		}
	}

}



module.exports= Contenedor;














