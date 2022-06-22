let express = require('express');
const pino = require('../utils/logger/pino');
let {Server:HttpServer} = require('http');
const Websocket = require("../components/mensajes/utils/websocket");
let cookieParser= require('cookie-parser');
let session = require("express-session"); 
let path = require("path");
const {config} = require('../config')
const cors = require('cors')

pino.info(config)

const PORT = config.PORT;
const CORS = config.CORS;
const serverRoutes = require("../routes");
const SESSION=config.SESSION;


class Server {
	constructor(){
	    this.app = express()
	    this.port = PORT
	    this.middlewares()
	    this.routes()
	    this.viewEngine()
	}
	middlewares(){
	    this.app.use(cors(CORS))
	    this.app.use(express.json())
	    this.app.use(express.urlencoded({extended: true}))
	    this.app.use(cookieParser())
	    this.app.use(session(SESSION))
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
	    const websocket = new Websocket(httpServer)
	    websocket.init()
	    httpServer.listen(this.port, ()=>{
		console.log(`Servidor iniciado en http://localhost:${this.port}`)
	    })
	}
    }
    
    module.exports = Server