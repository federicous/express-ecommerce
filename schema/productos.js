const mongoose = require("mongoose");
let {Schema, model} = mongoose;


// Schema del producto
const Joi = require("joi");
let id = Joi.string().min(3);
let name = Joi.string().min(3);
let code = Joi.string().min(3);
let label = Joi.string().min(3);
let origin = Joi.string().min(3);
let iva = Joi.string().min(3);
let price = Joi.number().min(3);
let stock = Joi.number().min(3);
let description = Joi.string().min(3);
let lista = Joi.string().min(3);
let marca = Joi.string().min(3);
let image = Joi.string().min(3);
let timestamp = Joi.string().min(3);
let uuid = Joi.string().min(3);


const productoSchema = {
	id: id.required(),
    	name: name.required(),
    	code: code.required(),
    	label: label.required(),
    	origin: origin.required(),
    	iva: iva.required(),
    	price: price.required(),
    	stock: stock.required(),
    	description: description.required(),
    	lista: lista.required(),
    	marca: marca.required(),
    	image: image.required(),
    	timestamp: timestamp.required(),
	uuid: uuid.required()
}

let productoSchemaModel = new Schema(productoSchema);
let ProductoModel = new model('productos', productoSchemaModel);

module.exports= ProductoModel;