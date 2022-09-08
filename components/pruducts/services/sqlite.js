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
				table.string('lista')
				table.string('marca')
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

	async save(producto,id) {
		try {
			if (id) {
				producto.id= id;
			}

			if (Array.isArray(producto)) {
				producto.forEach(async element => {
					element.uuid=uuid()
					let verificarExistente = await knex.from('productos').select('*').where({code:`${element.code}`, lista: `${element.lista}`});
					if (verificarExistente.length) {
						pino.info(`ya existe un producto con el mismo código ${element.code} en la lista ${element.lista}`);
						return{message:`ya existe el producto ${element.code}`}
					} else {	
						element.timestamp = Date.now();				
						let agregarProducto = await knex('productos').insert(element)
						pino.info(agregarProducto);
					}	
				});

			} else {
				let verificarExistente = await knex.from('productos').select('*').where({code:`${producto.code}`, lista: `${producto.lista}`});
				if (verificarExistente.length) {
					console.log(`ya existe un producto con el mismo código ${producto.code}`);
					return{message:`ya existe el producto ${producto.code}`}
				} else {	
					producto.timestamp = Date.now();
					let agregarProducto = await knex('productos').insert(producto)					
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
			let modificar = await knex.from('productos').select('*').where({id:`${id}`}).update(producto);
			return(modificar[0])


		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}	
	}
	
	async modifyAll(id, producto) {
		try {
			// let modificar = await knex.from('productos').select('*').where({id:`${id}`}).update(producto);
			// return(modificar[0])

			if (Array.isArray(producto)) {
				producto.forEach(async element => {
					element.uuid=uuid()
					let verificarExistente = await knex.from('productos').select('*').where({code:`${element.code}`, lista: `${element.lista}`});
					if (verificarExistente.length) {
						pino.info(`ya existe un producto con el mismo código ${element.code} en la lista ${element.lista}`);
						await knex.from('productos').select('*').where({code:`${element.code}`, lista: `${element.lista}`}).update(element);
						return{message:`ya existe el producto ${element.code}`}
					} else {	
						element.timestamp = Date.now();				
						let agregarProducto = await knex('productos').insert(element)
						pino.info(agregarProducto);
					}	
				});

			} else {
				let verificarExistente = await knex.from('productos').select('*').where({code:`${producto.code}`, lista: `${producto.lista}`});
				if (verificarExistente.length) {
					console.log(`ya existe un producto con el mismo código ${producto.code}`);
					await knex.from('productos').select('*').where({code:`${producto.code}`, lista: `${producto.lista}`}).update(producto);
					return{message:`ya existe el producto ${producto.code}`}
				} else {	
					producto.timestamp = Date.now();
					let agregarProducto = await knex('productos').insert(producto)					
					pino.info(agregarProducto);
				}
			}


		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}	
	}

	async getById(id) {
		try {
			let idProduct= parseInt(id);
			let mostrar = await knex.from('productos').select('*').where({id:id});
			return(mostrar[0])


		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}	
	}

	async getAll() {
		try {
			let mostrar = await knex.from('productos').select('*');
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
			let allProducts = await knex.from('productos').select('*').offset(`${skip}`).limit(`${PAGE_SIZE}`);
			let todosProductos = await knex.from('productos').select('*')
			let total = todosProductos.length
			return ({allProducts: allProducts,total: total})

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}
	}

	async getAllCategory(category) {
		try {
			let allProducts = await knex.from('productos').select('*').where({label:`${category}`});
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
			let allProducts = await knex.from('productos').select('*').where({label:`${category}`}).offset(`${skip}`).limit(`${PAGE_SIZE}`);
			// let total = await knex.from('productos').select('*').where({label:`${category}`}).count('*')
			let todos= await knex.from('productos').select('*').where({label:`${category}`})
			let total = todos.length
			return ({allProducts: allProducts,total: total})

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}
	}	

	async getAllCategoryPageLista(category,page,pageSize,lista) {
		try {
			const PAGE_SIZE = pageSize; // Similar a 'límite'
			const skip = (page - 1) * PAGE_SIZE;
			let allProducts = await knex.from('productos').select('*').where({label:`${category}`, lista: `${lista}`}).offset(`${skip}`).limit(`${PAGE_SIZE}`);
			// let total = await knex.from('productos').select('*').where({label:`${category}`}).count('*')
			let todos= await knex.from('productos').select('*').where({label:`${category}`, lista: `${lista}`})
			let total = todos.length
			return ({allProducts: allProducts,total: total})

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}
	}	

	async getAllPageLista(category,page,pageSize,lista) {
		try {
			const PAGE_SIZE = pageSize; // Similar a 'límite'
			const skip = (page - 1) * PAGE_SIZE;
			let allProducts = await knex.from('productos').select('*').where({lista: `${lista}`}).offset(`${skip}`).limit(`${PAGE_SIZE}`);
			// let total = await knex.from('productos').select('*').where({label:`${category}`}).count('*')
			let todos= await knex.from('productos').select('*').where({lista: `${lista}`})
			let total = todos.length
			return ({allProducts: allProducts,total: total})

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
			const contenido = await knex.from('productos').del()

		} catch (error) {
			throw new Error(error)
		}


	}
}



module.exports= Contenedor;















