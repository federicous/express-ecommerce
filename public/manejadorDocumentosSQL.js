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

	async leerProductos(){
		try {
			const contenido = await fs.promises.readFile(this.url, 'utf-8') 
			// console.log(contenido);
			return contenido

		} catch (error) {
			throw new Error(error)
		}
		
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
			let lectura=await this.leerProductos() ? await this.leerProductos() : []
			let infoArray=lectura.length ? JSON.parse(lectura) : [];
			let aux= infoArray
			let indice=aux.findIndex(product=>product.id==parseInt(id))
			aux.splice(indice,1)
			infoArray=[...aux]
			console.log(infoArray);	

			let actualizado=JSON.stringify(infoArray, null, 2)

			await fs.promises.writeFile(this.url, `${actualizado}`)


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















