require('dotenv').config()

let whitelist = ['http://localhost', 'https://ecommerce-fede.herokuapp.com/']
let corsOptions = {
	origin: function (origin, callback) {
		if (whitelist.indexOf(origin) !== -1) {
			callback(null, true)
		} else {
			callback(new Error('Not allowed by CORS'))
		}
	}
}

const config = {
	PORT: process.env.PORT || '8088',
	MONGO_ATLAS: process.env.MONGO_URL_ATLAS,
	CORS: corsOptions || "*",



}

module.exports = {config}