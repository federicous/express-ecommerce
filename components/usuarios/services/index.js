const {config} = require("../../../config");
let opcionDB= config.DB;

const pino = require('../../../utils/logger/pino');

	let UsuariosDB=require(`../services/${opcionDB}`);
	pino.info(`>>>>>>>>>>>>>> OPCION Usuarios: ${opcionDB}`);

module.exports = new UsuariosDB("usuarios");
