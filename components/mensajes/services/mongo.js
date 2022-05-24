// let {connection, mongoose} = require("../config/mongo");
let {connection, mongoose} = require("../../../config/mongo");
// let MensajeModel = require('../schema/mensajes')
let MensajeModel = require('../../../schema/mensajes')
const pino = require('../../../utils/logger/pino')

class MongoDB {


	async save(mensaje) {
		try {
			mensaje.timestamp=Date.now();
			let agregarMensajeModel= new MensajeModel(mensaje);
			let agregarMensaje = await agregarMensajeModel.save();
			pino.info(agregarMensaje);		
			
		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			
		}
	}
	async modify(mensaje,id) {
		try {
			// let modificar = await MensajeModel.updateOne({_id:id}, {
			// 	$set: mensaje
			// });
			let modificar = await MensajeModel.findByIdAndUpdate(id, mensaje);
			return(modificar)


		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			
		}	
	}

	async getById(id) {
		try {
			let mostrar = await MensajeModel.findById(id);
			return(mostrar)
		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			
		}	
	}

	async getAll() {
		try {
			let allMensajes = await MensajeModel.find({});
			// pino.info(allMensajes);
			return(allMensajes)
			
		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			
		}	
	}

	async deleteById(id) {
		try {
			// let borrar = await MensajeModel.deleteOne({"_id": id});
			let borrar = await MensajeModel.findByIdAndDelete(id);

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			
		}		
	}

	async deleteAll() {
		try {
			const contenido = await MensajeModel.deleteMany({});

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)

		}
	}
}

module.exports= MongoDB;















