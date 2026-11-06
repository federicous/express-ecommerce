let express = require('express');
let {Server:HttpServer} = require('http');
let cookieParser= require('cookie-parser');
let session = require("express-session"); 
let path = require("path");
const {config} = require('../config')
const cors = require('cors')

const PORT = config.PORT;
const HOST = config.HOST;
const CORS = config.CORS;
const serverRoutes = require("../routes");
const SESSION=config.SESSION;

class Server {
	constructor(){
	    this.app = express()
	    this.port = PORT
	    this.host = HOST
	    this.middlewares()
	    this.routes()
	    this.viewEngine()
	}
	middlewares(){
	    this.app.set('trust proxy', process.env.NODE_ENV === 'production' ? 1 : 0)
	    this.app.use(cors({
	        credentials: true,
	        origin: CORS,
	        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Cookie', 'Idempotency-Key']
	    }));
	    this.app.options('*', cors({
	        credentials: true,
	        origin: CORS
	    }));
	    this.app.use(express.json({limit: '50mb'}))
	    this.app.use(express.urlencoded({extended: true, limit: '50mb'}))
	    this.app.use(cookieParser())
	    this.app.use(session(SESSION))
	    this.app.use('/images', express.static(path.join(__dirname, '../uploads')));
	}
	routes(){
	    serverRoutes(this.app)
	}
	viewEngine(){
	    this.app.set('views', path.join(__dirname, "../views", "ejs"))
	    this.app.set('view engine', 'ejs')
	}
	init(){
	    const httpServer = new HttpServer(this.app)
	    // Legacy messaging is excluded from this first-stage release.
	    httpServer.listen(this.port, this.host, ()=>{
		console.log(`Servidor iniciado en http://localhost:${this.port} \nCORS: ${JSON.stringify(CORS)}`)
	    })
	    return httpServer
	}
}
    
module.exports = Server
