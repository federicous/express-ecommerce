let express = require('express');
let app = express();
const pino = require('./utils/logger/pino');
let {Server:HttpServer} = require('http');
const Websocket = require("./components/mensajes/utils/websocket");
let cookieParser= require('cookie-parser');
let session = require("express-session"); 
let MongoStore = require("connect-mongo");
let path = require("path");
const config = require('../config')

const PORT = config.PORT;
const MONGO_ATLAS= config.MONGO_ATLAS;
const CORS = config.CORS;
const serverRoutes = require("./routes");

const ejs= require("ejs")
app.set("views","./views/ejs")
app.set('view engine', 'ejs');

/* ####### SESION #######  */
let advancedOptions = {	useNewUrlParser: true,	useUnifiedTopology: true}
app.use(session({
	store: MongoStore.create({
		mongoUrl: MONGO_ATLAS,
		mongoOptions: advancedOptions		
	}),
	
	secret: "secret123",
	cookie: {maxAge: 1000*60*10},
	resave:false,
	saveUninitialized:false

}))

/* ####### FIN SESION #######  */

/* ############################## Websockets Chat ###################################### */
let httpServer = new HttpServer(app);
const websocket = new Websocket(httpServer);
websocket.init()

/* ############################## Fin Websockets Chat ###################################### */

serverRoutes(app);

httpServer.listen(PORT, ()=>{
	console.log(`Server on!: http://localhost:${PORT}`)
})

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
	}
	routes(){
	    serverRoutes(this.app)
	}
	viewEngine(){
	    this.app.set('views', path.join(__dirname, "../views", "ejs"))
	    this.app.set('view engine', 'ejs')
	}
	initialize(){
	    const httpServer = new HttpServer(this.app)
	    const websocket = new Websocket(httpServer)
	    websocket.init()
	    httpServer.listen(this.port, ()=>{
		console.log(`Servidor iniciado en http://localhost:${this.port}`)
	    })
	}
    }
    
    module.exports = Server