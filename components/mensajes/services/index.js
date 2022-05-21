const pino = require('../../../utils/logger/pino')
// Elegir la base de datos, con 1: MongoDB, 2: SQL, 3:Firebase
let opcionDB="firebase";

	let ProductosDB=require(`../services/${opcionDB}`)
	pino.info(`>>>>>>>>>>>>>> OPCION ${opcionDB}`);

module.exports = new ProductosDB("productos");
