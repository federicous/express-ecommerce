const {config} = require("../../../config");
let opcionDB= config.DB;
const pino = require('../../../utils/logger/pino')

	let CarritoDB=require(`../services/${opcionDB}`)
	pino.info(`>>>>>>>>>>>>>> OPCION Carritos: ${opcionDB}`);

module.exports = new CarritoDB("carrito");
