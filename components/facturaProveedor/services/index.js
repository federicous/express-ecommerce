const {config} = require("../../../config");
let opcionDB= config.DB;
const pino = require('../../../utils/logger/pino');

	let FacturaProveedorDB=require(`../services/${opcionDB}`);
	pino.info(`>>>>>>>>>>>>>> OPCION facturaProveedor: ${opcionDB}`);

module.exports = new FacturaProveedorDB("facturaProveedor");
