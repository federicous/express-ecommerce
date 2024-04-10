const {config} = require("../../../config");
let opcionDB= config.DB;
const pino = require('../../../utils/logger/pino');

	let facturaClientesDB=require(`../services/${opcionDB}`);
	pino.info(`>>>>>>>>>>>>>> OPCION facturaCliente: ${opcionDB}`);

module.exports = new facturaClientesDB("facturaClientes");
