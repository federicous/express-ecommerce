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
let emisor = Joi.string().min(3);
let timestamp = Joi.string().min(3);
let estado = Joi.string().min(3);


const chequeSchema = {
	id: id.required(),
	code: code.required(),
	cliente: cliente.required(),
	vendedor: vendedor.required(),
	monto: monto.required(),
	fecha: fecha.required(),
	banco: banco.required(),
	emisor: emisor.required(),
	timestamp: timestamp.required(),
	estado: estado.required(),
}

let chequeSchemaModel = new Schema(chequeSchema);
let ChequeModel = new model('cheques', chequeSchemaModel);

module.exports= ChequeModel;