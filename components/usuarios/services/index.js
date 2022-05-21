// Elegir la base de datos, con 1: MongoDB, 2: SQL, 3:Firebase
let opcionDB="mongo";
const pino = require('../../../utils/logger/pino')

	let UsuariosDB=require(`../services/${opcionDB}`)
	pino.info(`>>>>>>>>>>>>>> OPCION ${opcionDB}`);

module.exports = new UsuariosDB("usuarios");
