const mongoose = require("mongoose");
let {Schema, model} = mongoose;


// Schema del orden
const Joi = require("joi");
let id = Joi.string().min(3);
let email = Joi.string().min(3);
let state = Joi.string().min(3);
let timestamp = Joi.string().min(3);
let productList = Joi.array();
let presupuesto = Joi.string(); // Presupuesto puede ser una cadena vacía


const ordenSchema = {
	id: id.required(),
	email: email.required(),
	state: state.required(),
	timestamp: timestamp.required(),
	productList: productList.required(),
	presupuesto: presupuesto.required()
}

let ordenSchemaModel = new Schema(ordenSchema);
let OrdenModel = new model('ordenes', ordenSchemaModel);

module.exports= OrdenModel;