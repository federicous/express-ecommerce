const { uuid } = require('uuidv4');
const {mysqlConfig} = require('../config/mysqlDB');
const knex = require('knex')(mysqlConfig);


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
			console.log("ya existe la tabla");
		}
      	} catch (error){
		console.log(error);
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
			console.log("datos insertados")		

			return producto.id

		} catch (error) {
			console.log(`Error de lectura`, error);
			throw new Error(error)
		}		
	}
	
	async modify(producto,id) {
		try {
			let modificar = await knex.from('productos').select('*').where({id:`${id}`}).update(producto);
			return(modificar)


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















