let express = require('express');
let {Server:HttpServer} = require('http');
const fs = require('fs');
const https = require('https');
const Websocket = require("../components/mensajes/utils/websocket");
let cookieParser= require('cookie-parser');
let session = require("express-session"); 
let path = require("path");
const {config} = require('../config')
const cors = require('cors')

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
	//     this.app.use(cors({credentials: true, origin: `${CORS}`}))
	    this.app.use(cors({credentials: true, origin: CORS}))
	    this.app.use(express.json({limit: '50mb'}))
	    this.app.use(express.urlencoded({extended: true, limit: '50mb'}))
	    this.app.use(cookieParser())
	    this.app.use(session(SESSION))
	    this.app.use('/images', express.static('uploads'));

	    const httpsOptions = {
		key: fs.readFileSync(path.join('/etc/letsencrypt/live/app.distribuidorabrmtools.com/', 'privkey.pem')),
		cert: fs.readFileSync(path.join('/etc/letsencrypt/live/app.distribuidorabrmtools.com/', 'fullchain.pem')),
	      };
	    this.httpsServer = https.createServer(httpsOptions, this.app);
	}
	routes(){
	    serverRoutes(this.app)
	}
	viewEngine(){
	    this.app.set('views', path.join(__dirname, "../views", "ejs"))
	    this.app.set('view engine', 'ejs')
	}
	init(){
	//     const httpServer = new HttpServer(this.app)
	    	const websocket = new Websocket(this.httpsServer);
	    	websocket.init();
	      	this.httpsServer.listen(this.port, () => {
		console.log(`Servidor iniciado en https://localhost:${this.port}\nCORS: ${CORS}`);
	      });

	//     const websocket = new Websocket(httpServer)
	//     websocket.init()
	//     httpServer.listen(this.port, ()=>{
	// 	console.log(`Servidor iniciado en http://localhost:${this.port} \nCORS: ${CORS}`)
	//     })
	}
    }
    
    module.exports = Server