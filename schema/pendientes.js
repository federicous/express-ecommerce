const mongoose = require("mongoose");
let {Schema, model} = mongoose;


// Schema del pendientes
const Joi = require("joi");
let id = Joi.string().min(3);
let code = Joi.string().min(3);
let cliente = Joi.string().min(3);
let vendedor = Joi.string().min(3);
let listaProductos = Joi.string().min(3);
let fecha = Joi.string().min(3);
let detalle = Joi.string().min(3);
let estado = Joi.string().min(3);
let timestamp = Joi.string().min(3);


const pendientesSchema = {
	id: id.required(),
	code: code.required(),
	cliente: cliente.required(),
	vendedor: vendedor.required(),
	listaProductos: listaProductos.required(),
	fecha: fecha.required(),
	detalle: detalle.required(),
	estado: estado.required(),
	timestamp: timestamp.required(),
}

let pendientesSchemaModel = new Schema(pendientesSchema);
let PendientesModel = new model('pendientes', pendientesSchemaModel);

module.exports= PendientesModel;