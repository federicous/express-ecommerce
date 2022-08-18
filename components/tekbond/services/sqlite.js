const { uuid } = require('uuidv4');
const {sqliteConfig} = require('../../../config/sqlite');
const knex = require('knex')(sqliteConfig);
const pino = require('../../../utils/logger/pino');

(async()=>{
	try {
		let exists= await knex.schema.hasTable('tekbond');
		if (!exists) {
			await knex.schema.createTable('tekbond', table => {
				table.increments('id')
				table.string('name')
				table.string('code')
				table.string('codigobarra')
				table.string('linea')
				table.string('contenido')
				table.string('presentacion')
				table.string('color')
				table.string('unidades')
				table.float('usd')
				table.float('pvpusd')
				table.string('label')
				table.string('origin')
				table.string('iva')
				table.integer('stock')
				table.float('price')
				table.float('nota')
				table.string('description')
				table.string('lista')
				table.string('marca')
				table.string('image')
				table.string('reftekbond')
				table.string('tekbondcodigo')
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

	async save(producto,id) {
		try {
			if (id) {
				producto.id= id;
			}

			if (Array.isArray(producto)) {
				producto.forEach(async element => {
					element.uuid=uuid()
					let verificarExistente = await knex.from('tekbond').select('*').where({code:`${element.code}`});
					if (verificarExistente.length) {
						console.log(`ya existe un producto con el mismo código ${element.code}`);
						return{message:`ya existe el producto ${element.code}`}
					} else {	
						element.timestamp = Date.now();				
						let agregarProducto = await knex('tekbond').insert(element)
						pino.info(agregarProducto);
					}	
				});

			} else {
				let verificarExistente = await knex.from('tekbond').select('*').where({code:`${producto.code}`});
				if (verificarExistente.length) {
					console.log(`ya existe un producto con el mismo código ${element.code}`);
					return{message:`ya existe el producto ${producto.code}`}
				} else {	
					producto.timestamp = Date.now();
					let agregarProducto = await knex('tekbond').insert(producto)					
					pino.info(agregarProducto);
				}
			}


		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}		
	}
	
	async modify(id, producto) {
		try {
			let modificar = await knex.from('tekbond').select('*').where({id:`${id}`}).update(producto);
			return(modificar[0])


		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}	
	}

	async getById(id) {
		try {
			let idProduct= parseInt(id);
			let mostrar = await knex.from('tekbond').select('*').where({id:id});
			return(mostrar[0])


		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}	
	}

	async getAll() {
		try {
			let mostrar = await knex.from('tekbond').select('*');
			return mostrar

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}	
		
	}

	async getAllPage(page,pageSize) {
		try {
			const PAGE_SIZE = pageSize; // Similar a 'límite'
			const skip = (page - 1) * PAGE_SIZE;
			let allProducts = await knex.from('tekbond').select('*').offset(`${skip}`).limit(`${PAGE_SIZE}`);
			let todosProductos = await knex.from('tekbond').select('*')
			let total = todosProductos.length
			return ({allProducts: allProducts,total: total})

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}
	}

	async getAllCategory(category) {
		try {
			let allProducts = await knex.from('tekbond').select('*').where({label:`${category}`});
			return (allProducts)

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}
	}

	async getAllCategoryPage(category,page,pageSize) {
		try {
			const PAGE_SIZE = pageSize; // Similar a 'límite'
			const skip = (page - 1) * PAGE_SIZE;
			let allProducts = await knex.from('tekbond').select('*').where({label:`${category}`}).offset(`${skip}`).limit(`${PAGE_SIZE}`);
			// let total = await knex.from('tekbond').select('*').where({label:`${category}`}).count('*')
			let todos= await knex.from('tekbond').select('*').where({label:`${category}`})
			let total = todos.length
			return ({allProducts: allProducts,total: total})

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}
	}	

	async deleteById(id) {
		try {
			let borrar = await knex.from('tekbond').where({id:`${id}`}).del();


		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}		
	}

	async deleteAll() {
		try {
			const contenido = await knex.from('tekbond').del()

		} catch (error) {
			throw new Error(error)
		}


	}
}



module.exports= Contenedor;















