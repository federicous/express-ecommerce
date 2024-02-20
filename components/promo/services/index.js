const {config} = require("../../../config");
let opcionDB= config.DB;
const pino = require('../../../utils/logger/pino');

	let PromoDB=require(`../services/${opcionDB}`);
	pino.info(`>>>>>>>>>>>>>> OPCION Promo: ${opcionDB}`);

module.exports = new PromoDB("promo");
