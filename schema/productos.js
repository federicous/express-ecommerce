const mongoose = require("mongoose");
let {Schema, model} = mongoose;


// Schema del producto
const Joi = require("joi");
let id = Joi.string().min(3);
let name = Joi.string().min(3);
let code = Joi.string().min(3);
let codigobarra = Joi.string().min(3);
let linea = Joi.string().min(3);
let contenido = Joi.string().min(3);
let presentacion = Joi.string().min(3);
let color = Joi.string().min(3);
let unidades = Joi.string().min(3);
let usd = Joi.number().min(3);
let pvpusd = Joi.number().min(3);
let reftekbond = Joi.string().min(3);
let tekbondcodigo = Joi.string().min(3);
let label = Joi.string().min(3);
let origin = Joi.string().min(3);
let iva = Joi.string().min(3);
let price = Joi.number().min(3);
let pricepack = Joi.number().min(3);
let stock = Joi.number().min(3);
let description = Joi.string().min(3);
let lista = Joi.string().min(3);
let marca = Joi.string().min(3);
let image = Joi.string().min(3);
let rosca = Joi.string().min(3);
let cabeza = Joi.string().min(3);
let punta = Joi.string().min(3);
let terminacion = Joi.string().min(3);
let timestamp = Joi.string().min(3);
let uuid = Joi.string().min(3);


const productoSchema = {
	id: id.required(),
    	name: name.required(),
    	code: code.required(),
    	codigobarra: codigobarra.required(),
    	linea: linea.required(),
    	contenido: contenido.required(),
    	presentacion: presentacion.required(),
    	color: color.required(),
    	unidades: unidades.required(),
    	usd: usd.required(),
    	pvpusd: pvpusd.required(),
    	reftekbond: reftekbond.required(),
    	tekbondcodigo: tekbondcodigo.required(),
    	label: label.required(),
    	origin: origin.required(),
    	iva: iva.required(),
    	price: price.required(),
    	pricepack: pricepack.required(),
    	stock: stock.required(),
    	description: description.required(),
    	lista: lista.required(),
    	marca: marca.required(),
    	image: image.required(),
    	rosca: rosca.required(),
    	cabeza: cabeza.required(),
    	punta: punta.required(),
    	terminacion: terminacion.required(),
    	timestamp: timestamp.required(),
	uuid: uuid.required()
}

let productoSchemaModel = new Schema(productoSchema);
let ProductoModel = new model('productos', productoSchemaModel);

module.exports= ProductoModel;