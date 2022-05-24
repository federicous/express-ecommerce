require("dotenv").config();
let opcionDB= process.env.DB || "mongo";
const pino = require('../../../utils/logger/pino')

	let MensajesDB=require(`../services/${opcionDB}`)
	pino.info(`>>>>>>>>>>>>>> OPCION Mensajes: ${opcionDB}`);

module.exports = new MensajesDB("mensajes");
