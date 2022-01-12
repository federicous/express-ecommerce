const uuidv4 = require('uuidv4').uuid;
// const {mysqlConfig} = require('../config/mysqlDB');
// const knex = require('knex')(mysqlConfig);

const mongoose = require("mongoose");
let {Schema, model} = mongoose;

let connection;
const MONGO_URL_RAIZ="mongodb://localhost:27017/";
const DB_NAME="ecommerce";
const MONGO_URI=MONGO_URL_RAIZ+DB_NAME;

// Conexión con MongoDB utilizando Mongoose
(async()=>{
	try {
		connection= mongoose.connect(MONGO_URI, {useNewUrlParser:true,useUnifiedTopology: true });
		console.log("-------------> conexión MongoDB OK!!");
	} catch (error) {
		console.log(error);
	}

})();

// Schema del producto
const Joi = require("joi");
let id = Joi.number().min(3);
let email = Joi.string().min(3);
let mensaje = Joi.string().min(3);
let timestamp = Joi.string().min(3);
let uuid = Joi.string().min(3);


const productoSchema = {
	id: id.required(),
    	email: email.required(),
    	mensaje: mensaje.required(),
    	timestamp: timestamp.required(),
	uuid: uuid.required()
}

let productoSchemaModel = new Schema(productoSchema);
let ProductoModel = new model('mensajes', productoSchemaModel);

class MongoDB {

	constructor(tabla) {
		this.tabla=tabla;
	}

	async save(producto,id) {
		try {
			if (id) {
				producto.id= id;
			}
			producto.uuid=uuidv4();
			producto.timestamp=Date.now();
			let agregarProductoModel= new ProductoModel(producto);
			let agregarProducto = await agregarProductoModel.save();
			console.log(agregarProducto);			

			
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

	// async getById(id) {
	// 	try {
	// 		let mostrar = await knex.from('productos').select('*').where({id:`${id}`});
	// 		return(mostrar)


	// 	} catch (error) {
	// 		console.log(`Error de lectura`, error);
	// 		throw new Error(error)
	// 	}	
	// }

	async getAll() {
		try {
			let allProducts = await ProductoModel.find();
			console.log(allProducts);
			return(allProducts)
			
		} catch (error) {
			console.log(`Error de lectura`, error);
			throw new Error(error)
		}
	// 	try {
	// 		let mostrar = await knex.from('productos').select('*');
	// 		console.log(mostrar);
	// 		return mostrar

	// 	} catch (error) {
	// 		console.log(`Error de lectura`, error);
	// 		throw new Error(error)
	// 	}	
		
	}

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















