const mongoose = require("mongoose");
let {Schema, model} = mongoose;


// Schema del cheque
const Joi = require("joi");
let id = Joi.string().min(3);
let code = Joi.string().min(3);
let cliente = Joi.string().min(3);
let vendedor = Joi.string().min(3);
let monto = Joi.string().min(3);
let fecha = Joi.string().min(3);
let banco = Joi.string().min(3);
let bancoOtro = Joi.string().min(3);
let emisor = Joi.string().min(3);
let timestamp = Joi.string().min(3);
let estado = Joi.string().min(3);
let tipo = Joi.string().min(3);
let ferreteria = Joi.string().min(3);
let name = Joi.string().min(3);


const chequeSchema = {
	id: id.required(),
	code: code.required(),
	cliente: cliente.required(),
	vendedor: vendedor.required(),
	monto: monto.required(),
	fecha: fecha.required(),
	banco: banco.required(),
	bancoOtro: bancoOtro.required(),
	emisor: emisor.required(),
	timestamp: timestamp.required(),
	estado: estado.required(),
	tipo: tipo.required(),
	name: name.required(),
	ferreteria: ferreteria.required(),
}

let chequeSchemaModel = new Schema(chequeSchema);
let ChequeModel = new model('cheques', chequeSchemaModel);

module.exports= ChequeModel;