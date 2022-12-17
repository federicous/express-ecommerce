const {config} = require("../../../config");
let opcionDB= config.DB;

const pino = require('../../../utils/logger/pino');

	let DolarDB=require(`../services/${opcionDB}`);
	pino.info(`>>>>>>>>>>>>>> OPCION DolarAutomatico: ${opcionDB}`);

module.exports = new DolarDB;


