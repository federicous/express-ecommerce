// Elegir la base de datos, con 1: MongoDB, 2: SQL, 3:Firebase
require("dotenv").config();
let opcionDB= process.env.DB || "mongo";

const pino = require('../../../utils/logger/pino')

	let UsuariosDB=require(`../services/${opcionDB}`)
	pino.info(`>>>>>>>>>>>>>> OPCION Usuarios: ${opcionDB}`);

module.exports = new UsuariosDB("usuarios");
