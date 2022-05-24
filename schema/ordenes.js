const mongoose = require("mongoose");
let {Schema, model} = mongoose;


// Schema del orden
const Joi = require("joi");
let id = Joi.string().min(3);
let email = Joi.string().min(3);
let state = Joi.string().min(3);
let timestamp = Joi.string().min(3);
let productList = Joi.array()


const ordenSchema = {
	id: id.required(),
    	email: email.required(),
    	state: state.required(),
    	timestamp: timestamp.required(),
	productList: productList.required()
}

let ordenSchemaModel = new Schema(ordenSchema);
let OrdenModel = new model('ordenes', ordenSchemaModel);

module.exports= OrdenModel;