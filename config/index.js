require('dotenv').config()
let MongoStore = require("connect-mongo");
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const Knex = require('knex');

// const MONGO_ATLAS = process.env.MONGO_URL_ATLAS;
const MONGO_ATLAS = process.env.MONGO_URI;
const MONGO_SECRET = process.env.MONGO_SECRET || "nkl3erkwehf89";
const COOKIE_AGE = process.env.COOKIE_AGE || 1000 * 60 * 10;
let CORS_CLIENT="http://localhost:3000";

if (process.env.NODE_ENV === 'production') {
	CORS_CLIENT= "http://app.distribuidorabrmtools.com"
      }

console.log(CORS_CLIENT);

let advancedOptions = {
	useNewUrlParser: true,
	useUnifiedTopology: true
}

const knex = Knex({
	client: 'sqlite3',
	connection: {
	filename: 'DB/mydbSession.sqlite'
	},
	useNullAsDefault: true,	
      });

let sessionConfig = {};
if (process.env.DB == 'mongo') {
	console.log(`session mongo`);
	sessionConfig = {
		store: MongoStore.create({
			mongoUrl: MONGO_ATLAS,
			mongoOptions: advancedOptions
		}),
		secret: MONGO_SECRET,
		cookie: {
			maxAge: COOKIE_AGE
		},
		resave: false,
		saveUninitialized: false
	}
} else {
	console.log(`session sqlite`);
	sessionConfig = {
		store: new KnexSessionStore({
			knex,	
		}),		
		secret: MONGO_SECRET,
		cookie: {
			maxAge: COOKIE_AGE
		},
		resave: false,
		saveUninitialized: false
	}
}


const config = {
	PORT: process.env.PORT || '8088',
	MONGO_ATLAS: MONGO_ATLAS,
	CORS: process.env.CORS || "*",
	SESSION: sessionConfig,
	DB: process.env.DB || "mongo",
	CORS: CORS_CLIENT || "http://localhost:3000"
}

const mysql = {
	MARIADB_HOST: process.env.MARIADB_HOST,
	MARIADB_USER: process.env.MARIADB_USER,
	MARIADB_PASS: process.env.MARIADB_PASS,
	MARIADB_DATABASE: process.env.MARIADB_DATABASE
}


const correo = {
	NODEMAILER_USER: process.env.NODEMAILER_USER,
	NODEMAILER_PASS: process.env.NODEMAILER_PASS,
	NODEMAILER_HOST: process.env.NODEMAILER_HOST,
	NODEMAILER_PORT: process.env.NODEMAILER_PORT,
	NODEMAILER_ADMIN: process.env.NODEMAILER_ADMIN,
}

const autenticacion = {
	JWT_SECRET: process.env.JWT_SECRET || "943onfdis",
	JWT_ALG: process.env.JWT_ALG || "HS256",
	JWT_EXP: process.env.JWT_EXP || "1d",
}

module.exports = {
	config,
	correo,
	autenticacion,
	mysql
}