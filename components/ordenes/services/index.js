const {config} = require("../../../config");
let opcionDB= config.DB;
const pino = require('../../../utils/logger/pino');

	let OrdenesDB=require(`../services/${opcionDB}`);
	pino.info(`>>>>>>>>>>>>>> OPCION Ordenes: ${opcionDB}`);

module.exports = new OrdenesDB("ordenes");
