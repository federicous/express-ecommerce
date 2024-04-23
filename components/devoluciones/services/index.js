const {config} = require("../../../config");
let opcionDB= config.DB;
const pino = require('../../../utils/logger/pino');

	let DevolucionesDB=require(`../services/${opcionDB}`);
	pino.info(`>>>>>>>>>>>>>> OPCION devoluciones: ${opcionDB}`);

module.exports = new DevolucionesDB("devoluciones");
