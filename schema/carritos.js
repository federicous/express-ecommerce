const mongoose = require("mongoose");
let {Schema, model} = mongoose;


// Schema del carrito
const Joi = require("joi");
let id = Joi.string().min(3);
let email = Joi.string().min(3);
let address = Joi.string().min(3);
let timestamp = Joi.string().min(3);
let productList = Joi.array()


const carritoSchema = {
	id: id.required(),
    	email: email.required(),
    	address: address.required(),
    	timestamp: timestamp.required(),
	productList: productList.required()
}

let carritoSchemaModel = new Schema(carritoSchema);
let CarritoModel = new model('carritos', carritoSchemaModel);

module.exports= CarritoModel;