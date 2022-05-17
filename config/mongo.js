const mongoose = require("mongoose");
require("dotenv").config();

let connection;
// const MONGO_URI=process.env.MONGO_URL_RAIZ+process.env.DB_NAME;
const MONGO_URI=process.env.MONGO_URL_ATLAS;

// Conexión con MongoDB utilizando Mongoose
(async()=>{
	try {
		connection= mongoose.connect(MONGO_URI, {useNewUrlParser:true,useUnifiedTopology: true });
		console.log("-------------> conexión MongoDB OK!!");
	} catch (error) {
		console.log(error);
	}

})();

module.exports = {connection, mongoose};