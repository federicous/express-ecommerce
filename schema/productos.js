const mongoose = require("mongoose");
let {Schema, model} = mongoose;


// Schema del producto
const Joi = require("joi");
let id = Joi.string().min(3);
let name = Joi.string().min(3);
let price = Joi.number().min(3);
let stock = Joi.number().min(3);
let description = Joi.string().min(3);
let image = Joi.string().min(3);
let timestamp = Joi.string().min(3);
let uuid = Joi.string().min(3);


const productoSchema = {
	id: id.required(),
    	name: name.required(),
    	price: price.required(),
    	stock: stock.required(),
    	description: description.required(),
    	image: image.required(),
    	timestamp: timestamp.required(),
	uuid: uuid.required()
}

let productoSchemaModel = new Schema(productoSchema);
let ProductoModel = new model('productos', productoSchemaModel);

module.exports= ProductoModel;