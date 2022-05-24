require("dotenv").config();
let opcionDB= process.env.DB || "mongo";
const pino = require('../../../utils/logger/pino')

	let OrdenesDB=require(`../services/${opcionDB}`)
	pino.info(`>>>>>>>>>>>>>> OPCION Ordenes: ${opcionDB}`);

module.exports = new OrdenesDB("ordenes");
