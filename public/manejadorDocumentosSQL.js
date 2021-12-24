const fs = require('fs')
const { uuid } = require('uuidv4');
const {mysqlConfig} = require('../config/mysqlDB');
const knex = require('knex')(mysqlConfig);

class Contenedor {

	constructor(mysqlConfig) {
		this.contador=1;
		this.knex = require('knex')(mysqlConfig);
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
			console.log("datos insertados")		

			return producto.id

		} catch (error) {
			console.log(`Error de lectura`, error);
			throw new Error(error)
		}		
	}

	async getById(id) {
		try {
			let mostrar = await knex.from('productos').select('*').where({id:`${id}`});
			return(mostrar)


		} catch (error) {
			console.log(`Error de lectura`, error);
			throw new Error(error)
		}	
	}

	async getAll() {
		try {
			let mostrar = await knex.from('productos').select('*');
			console.log(mostrar);
			return mostrar

		} catch (error) {
			console.log(`Error de lectura`, error);
			throw new Error(error)
		}	
		
	}

	async deleteById(id) {
		try {
			let borrar = await knex.from('productos').where({id:`${id}`}).del();


		} catch (error) {
			console.log(`Error de lectura`, error);
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















