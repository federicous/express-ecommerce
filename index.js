let express = require('express')
let app = express()
// const PORT = process.env.PORT;
// const { Router } = express
// const router = Router()
// const routerProd = Router()
// const routerCart = Router()
// const raiz= Router()
let {Server:HttpServer} = require('http')
let {Server:SocketIO} = require('socket.io');
let cookieParser= require('cookie-parser')
let session = require("express-session"); 
let MongoStore = require("connect-mongo")
let path = require("path");
require("dotenv").config();
const PORT = process.env.PORT || '8088';
const MONGO_ATLAS=process.env.MONGO_URL_ATLAS;
const serverRoutes = require("./routes");
// const authJwt = require("./helpers/jwt");

// vistas
// app.set("views", path.join(__dirname, 'views', 'ejs'))
const ejs= require("ejs")
app.set('view engine', 'ejs');
app.set("views","./views/ejs")


// ACCESO DE ADMINISTRADOR
let acceso = {
	isAdmin : function (req, res, next) {
	      if (req.headers.admin=="true") {
		 return next();
	      }else{
		 res.json({ error : -1, descripcion: "ruta 'x' método 'y' no autorizada" })
		 res.redirect('/');
	      }      
	}
     };

// Utilidades
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// app.use(authJwt())
// app.use(express.static("./public"));

app.use(cookieParser())

/* ####### SESION #######  */
let advancedOptions = {	useNewUrlParser: true,	useUnifiedTopology: true}
app.use(session({
	store: MongoStore.create({
		mongoUrl: MONGO_ATLAS,
		mongoOptions: advancedOptions		
	}),
	// store: MongoStore.create({mongoUrl: 'mongodb://localhost:27017/sessiones3'}),
	
	secret: "secret123",
/* 	cookie:{
	    httpOnly: false,
	    secure: false,
	    maxAge: 60000
	}, */
	cookie: {maxAge: 1000*60*10},
	resave:false,
	saveUninitialized:false
/* 	resave:true,
	saveUninitialized: true */
}))
/* 

/* ####### FIN SESION #######  */

serverRoutes(app);


// app.get('/verProductos', async (req, res) => {
// 	res.sendFile(__dirname + '/public/productos.html');
// })

/* ############################## Websockets Chat ###################################### */
let httpServer = new HttpServer(app);
let socketIOServer = new SocketIO(httpServer);

socketIOServer.on('connection', async socket =>{

	console.log(`Nuevo usuario: ${socket.id}`);

	// Mensajes
	let misMensajesGuardados= await misMensajes.getAll()
	await socketIOServer.sockets.emit('chat', misMensajesGuardados)
	
	await socket.on('userMsg', async data =>{
		console.log(data);
		await misMensajes.save(data)
		misMensajesGuardados= await misMensajes.getAll()
		await socketIOServer.sockets.emit('chat', misMensajesGuardados)
	})

})
/* ############################## Fin Websockets Chat ###################################### */

httpServer.listen(PORT, ()=>{
	console.log(`Server on!: http://localhost:${PORT}`)
})