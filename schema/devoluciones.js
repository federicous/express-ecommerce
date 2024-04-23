const mongoose = require("mongoose");
let {Schema, model} = mongoose;


// Schema del devoluciones
const Joi = require("joi");
let id = Joi.string().min(3);
let code = Joi.string().min(3);
let cliente = Joi.string().min(3);
let vendedor = Joi.string().min(3);
let codigoProducto = Joi.string().min(3);
let fecha = Joi.string().min(3);
let detalle = Joi.string().min(3);
let tipo = Joi.string().min(3);
let timestamp = Joi.string().min(3);
let medioDePago = Joi.string().min(3);


const devolucionesSchema = {
	id: id.required(),
	code: code.required(),
	cliente: cliente.required(),
	vendedor: vendedor.required(),
	codigoProducto: codigoProducto.required(),
	fecha: fecha.required(),
	detalle: detalle.required(),
	tipo: tipo.required(),
	timestamp: timestamp.required(),
	medioDePago: medioDePago.required(),
}

let devolucionesSchemaModel = new Schema(devolucionesSchema);
let DevolucionesModel = new model('devoluciones', devolucionesSchemaModel);

module.exports= DevolucionesModel;