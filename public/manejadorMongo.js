// const { uuid } = require('uuidv4');
// const {mysqlConfig} = require('../config/mysqlDB');
// const knex = require('knex')(mysqlConfig);

const mongoose = require("mongoose");

let connection;
const MONGO_URL_RAIZ="mongodb://localhost:27017/";
const DB_NAME="ecommerce";
const MONGO_URI=MONGO_URL_RAIZ+DB_NAME;

(async()=>{
	try {
		connection= mongoose.connect(MONGO_URI, {useNewUrlParser:true,useUnifiedTopology: true });
		console.log("-------------> conexión MongoDB");

	} catch (error) {
		console.log(error);
	}

})();


class MongoDB {

	constructor(tabla) {
		this.tabla=tabla;
	}

	// async save(producto,id) {
	// 	try {
	// 		if (id) {
	// 			producto.id= id;
	// 		}
	// 		producto.uuid=uuid()
	// 		let agregar= await knex('productos')
	// 		.insert(producto)
	// 		console.log("datos insertados")		

	// 		return producto.id

	// 	} catch (error) {
	// 		console.log(`Error de lectura`, error);
	// 		throw new Error(error)
	// 	}		
	// }
	
	// async modify(producto,id) {
	// 	try {
	// 		let modificar = await knex.from('productos').select('*').where({id:`${id}`}).update(producto);
	// 		return(modificar)


	// 	} catch (error) {
	// 		console.log(`Error de lectura`, error);
	// 		throw new Error(error)
	// 	}	
	// }

	// async getById(id) {
	// 	try {
	// 		let mostrar = await knex.from('productos').select('*').where({id:`${id}`});
	// 		return(mostrar)


	// 	} catch (error) {
	// 		console.log(`Error de lectura`, error);
	// 		throw new Error(error)
	// 	}	
	// }

	// async getAll() {
	// 	try {
	// 		let mostrar = await knex.from('productos').select('*');
	// 		console.log(mostrar);
	// 		return mostrar

	// 	} catch (error) {
	// 		console.log(`Error de lectura`, error);
	// 		throw new Error(error)
	// 	}	
		
	// }

	// async deleteById(id) {
	// 	try {
	// 		let borrar = await knex.from('productos').where({id:`${id}`}).del();


	// 	} catch (error) {
	// 		console.log(`Error de lectura`, error);
	// 		throw new Error(error)
	// 	}		
	// }

	// async deleteAll() {
	// 	try {
	// 		const contenido = await fs.promises.writeFile(this.url,[])

	// 	} catch (error) {
	// 		throw new Error(error)
	// 	}


	// }
}



module.exports= MongoDB;















