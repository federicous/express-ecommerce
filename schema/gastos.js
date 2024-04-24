const mongoose = require("mongoose");
let {Schema, model} = mongoose;


// Schema del gastos
const Joi = require("joi");
let id = Joi.string().min(3);
let code = Joi.string().min(3);
let gasto = Joi.string().min(3);
let detalle = Joi.string().min(3);
let monto = Joi.string().min(3);
let fecha = Joi.string().min(3);
let vencimiento = Joi.string().min(3);
let tipo = Joi.string().min(3);
let timestamp = Joi.string().min(3);
let medioDePago = Joi.string().min(3);


const gastosSchema = {
	id: id.required(),
	code: code.required(),
	gasto: gasto.required(),
	detalle: detalle.required(),
	monto: monto.required(),
	fecha: fecha.required(),
	vencimiento: vencimiento.required(),
	tipo: tipo.required(),
	timestamp: timestamp.required(),
	medioDePago: medioDePago.required(),
}

let gastosSchemaModel = new Schema(gastosSchema);
let GastosModel = new model('gastos', gastosSchemaModel);

module.exports= GastosModel;