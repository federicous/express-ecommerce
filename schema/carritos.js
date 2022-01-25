const mongoose = require("mongoose");
let {Schema, model} = mongoose;


// Schema del carrito
const Joi = require("joi");
let id = Joi.string().min(3);
let username = Joi.string().min(3);
let timestamp = Joi.string().min(3);
let uuid = Joi.string().min(3);
let productList = Joi.array()


const carritoSchema = {
	id: id.required(),
    	username: username.required(),
    	timestamp: timestamp.required(),
	uuid: uuid.required(),
	productList: productList.required()
}

let carritoSchemaModel = new Schema(carritoSchema);
let CarritoModel = new model('carritos', carritoSchemaModel);

module.exports= CarritoModel;