// Elegir la base de datos, con 1: MongoDB, 2: SQL, 3:Firebase
require("dotenv").config();
let opcionDB= process.env.DB || "mongo";
const pino = require('../../../utils/logger/pino');

	let ProductosDB=require(`../services/${opcionDB}`);
	pino.info(`>>>>>>>>>>>>>> OPCION Produtos: ${opcionDB}`);

module.exports = new ProductosDB("productos");
