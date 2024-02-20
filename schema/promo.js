const mongoose = require("mongoose");
let {Schema, model} = mongoose;


// Schema delpromo 
const Joi = require("joi");
let id = Joi.string().min(3);
let image = Joi.string().min(3);
let timestamp = Joi.string().min(3);
let habilitar = Joi.string();


const promoSchema = {
	id: id.required(),
    	timestamp: timestamp.required(),
    	habilitar: habilitar.required(),
	image: image.required()
}

let promoSchemaModel = new Schema(promoSchema);
let PromoModel = new model('promo', promoSchemaModel);

module.exports= PromoModel;