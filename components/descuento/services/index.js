const {config} = require("../../../config");
let opcionDB= config.DB;

const pino = require('../../../utils/logger/pino');

	let DescuentoDB=require(`../services/${opcionDB}`);
	pino.info(`>>>>>>>>>>>>>> OPCION Auth: ${opcionDB}`);

module.exports = new DescuentoDB;
