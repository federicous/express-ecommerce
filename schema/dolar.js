const mongoose = require("mongoose");
let {Schema, model} = mongoose;


// Schema deldolar 
const Joi = require("joi");
let id = Joi.string().min(3);
let dolar = Joi.string().min(3);
let tipo = Joi.string().min(3);
let timestamp = Joi.string().min(3);


const dolarSchema = {
	id: id.required(),
    	dolar: dolar.required(),
    	timestamp: timestamp.required(),
	tipo: tipo.required()
}

let dolarSchemaModel = new Schema(dolarSchema);
let DolarModel = new model('dolar', dolarSchemaModel);

module.exports= DolarModel;