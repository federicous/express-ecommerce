require("dotenv").config();
let opcionDB= process.env.DB || "mongo";
const pino = require('../../../utils/logger/pino')

	let CarritoDB=require(`../services/${opcionDB}`)
	pino.info(`>>>>>>>>>>>>>> OPCION Carritos: ${opcionDB}`);

module.exports = new CarritoDB("carrito");
