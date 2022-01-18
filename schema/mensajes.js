const mongoose = require("mongoose");
let {Schema, model} = mongoose;

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

module.exports= ProductoModel;