const {config} = require("../../../config");
let opcionDB= config.DB;
const pino = require('../../../utils/logger/pino');

	let ProductosDB=require(`../services/${opcionDB}`);
	pino.info(`>>>>>>>>>>>>>> OPCION Novedades: ${opcionDB}`);

module.exports = new ProductosDB("productos");
