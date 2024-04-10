const mongoose = require("mongoose");
let {Schema, model} = mongoose;


// Schema del facturaCliente
const Joi = require("joi");
let id = Joi.string().min(3);
let code = Joi.string().min(3);
let cliente = Joi.string().min(3);
let vendedor = Joi.string().min(3);
let monto = Joi.string().min(3);
let fecha = Joi.string().min(3);
let vencimiento = Joi.string().min(3);
let tipo = Joi.string().min(3);
let timestamp = Joi.string().min(3);


const facturaClienteSchema = {
	id: id.required(),
	code: code.required(),
	cliente: cliente.required(),
	vendedor: vendedor.required(),
	monto: monto.required(),
	fecha: fecha.required(),
	vencimiento: vencimiento.required(),
	tipo: tipo.required(),
	timestamp: timestamp.required(),
}

let facturaClienteSchemaModel = new Schema(facturaClienteSchema);
let FacturaClienteModel = new model('facturaClientes', facturaClienteSchemaModel);

module.exports= FacturaClienteModel;