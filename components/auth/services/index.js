// Elegir la base de datos, con 1: MongoDB, 2: SQL, 3:Firebase
const {config} = require("../../../config");
let opcionDB= config.DB;

const pino = require('../../../utils/logger/pino');

	let AuthDB=require(`../services/${opcionDB}`);
	pino.info(`>>>>>>>>>>>>>> OPCION Auth: ${opcionDB}`);

module.exports = new AuthDB;
