const mongoose = require("mongoose");
let {Schema, model} = mongoose;


// Schema del facturaProveedor
const Joi = require("joi");
let id = Joi.string().min(3);
let code = Joi.string().min(3);
let proveedor = Joi.string().min(3);
let vendedor = Joi.string().min(3);
let monto = Joi.string().min(3);
let fecha = Joi.string().min(3);
let vencimiento = Joi.string().min(3);
let tipo = Joi.string().min(3);
let timestamp = Joi.string().min(3);
let ferreteria = Joi.string().min(3);
let name = Joi.string().min(3);
let email = Joi.string().min(3);


const facturaProveedorSchema = {
	id: id.required(),
	code: code.required(),
	proveedor: proveedor.required(),
	vendedor: vendedor.required(),
	monto: monto.required(),
	fecha: fecha.required(),
	vencimiento: vencimiento.required(),
	tipo: tipo.required(),
	timestamp: timestamp.required(),
	name: name.required(),
	ferreteria: ferreteria.required(),
	email: email.required(),
}

let facturaProveedorSchemaModel = new Schema(facturaProveedorSchema);
let FacturaProveedorModel = new model('facturaProveedor', facturaProveedorSchemaModel);

module.exports= FacturaProveedorModel;