require('dotenv').config()
let MongoStore = require("connect-mongo");

const MONGO_ATLAS=process.env.MONGO_URL_ATLAS;
const MONGO_SECRET=process.env.MONGO_SECRET;
const COOKIE_AGE=process.env.COOKIE_AGE;

let advancedOptions = {	useNewUrlParser: true,	useUnifiedTopology: true}

let sessionConfig = {
	store: MongoStore.create({
		mongoUrl: MONGO_ATLAS,
		mongoOptions: advancedOptions
	}),
	secret: MONGO_SECRET,
	cookie: {
		maxAge: COOKIE_AGE || 1000 * 60 * 10
	},
	resave: false,
	saveUninitialized: false
}

const config = {
	PORT: process.env.PORT || '8088',
	MONGO_ATLAS: process.env.MONGO_URL_ATLAS,
	CORS: process.env.CORS || "*",
	SESSION: sessionConfig,
}

module.exports = {
	config
}