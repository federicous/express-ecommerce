const {config} = require("../../../config");
let opcionDB= config.DB;
const pino = require('../../../utils/logger/pino');

	let cobroClientesDB=require(`../services/${opcionDB}`);
	pino.info(`>>>>>>>>>>>>>> OPCION cobroCliente: ${opcionDB}`);

module.exports = new cobroClientesDB("cobroClientes");
