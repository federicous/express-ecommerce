const mongoose = require("mongoose");
const {config}= require("../config")
const pino = require('../utils/logger/pino')

let connection;
const MONGO_URI=config.MONGO_ATLAS;

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