// Elegir la base de datos, con 1: MongoDB, 2: SQL, 3:Firebase
const {config} = require("../../../config");
let opcionDB= config.DB;

const pino = require('../../../utils/logger/pino');

	let DescargasDB=require(`../services/${opcionDB}`);
	pino.info(`>>>>>>>>>>>>>> OPCION Descargas: ${opcionDB}`);

module.exports = new DescargasDB;
