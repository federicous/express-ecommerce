const mongoose = require("mongoose");
let {Schema, model} = mongoose;


// Schema del usuario 
const Joi = require("joi");
let id = Joi.string().min(3);
let name = Joi.string().min(3);
let password = Joi.string().min(3);
let age = Joi.number().min(3);
let email = Joi.string().min(3);
let address = Joi.string().min(3);
let phone = Joi.string().min(3);
let avatar = Joi.string().min(3);
let timestamp = Joi.string().min(3);
let isAdmin = Joi.boolean();


const usuarioSchema = {
	id: id.required(),
    	name: name.required(),
    	password: password.required(),
    	age: age.required(),
    	email: email.required(),
    	address: address.required(),
    	phone: phone.required(),
	avatar: avatar.required(),
	timestamp: timestamp.required(),
	isAdmin: isAdmin.required()
}

let usuarioSchemaModel = new Schema(usuarioSchema);
let UsuarioModel = new model('usuarios', usuarioSchemaModel);

module.exports= UsuarioModel;