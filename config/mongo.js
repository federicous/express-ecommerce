const mongoose = require("mongoose");
require("dotenv").config();
const pino = require('../utils/logger/pino')

let connection;
// const MONGO_URI=process.env.MONGO_URL_RAIZ+process.env.DB_NAME;
const MONGO_URI=process.env.MONGO_URL_ATLAS;

// Conexión con MongoDB utilizando Mongoose
(async()=>{
	try {
		connection= mongoose.connect(MONGO_URI, {useNewUrlParser:true,useUnifiedTopology: true });
		pino.info("-------------> conexión MongoDB OK!!");
	} catch (error) {
		pino.error(`Se produjo un error: ${error}`)
	}

})();

module.exports = {connection, mongoose};