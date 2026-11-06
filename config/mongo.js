const mongoose = require("mongoose");
const {config}= require("../config")
const pino = require('../utils/logger/pino')

let connection;
const MONGO_URI=config.MONGO_URI;

// Conexión con MongoDB utilizando Mongoose. La conexión es asíncrona: registrar
// el éxito inmediatamente ocultaba ECONNREFUSED cuando MongoDB no estaba activo.
connection = mongoose.connect(MONGO_URI, {useNewUrlParser:true,useUnifiedTopology: true });
connection
	.then(() => pino.info("-------------> conexión MongoDB OK!!"))
	.catch(() => pino.error({ code: 'MONGO_CONNECTION_FAILED' }, 'No se pudo conectar a MongoDB')); // Never log URI, credentials or untrusted driver messages.

module.exports = {connection, mongoose};
