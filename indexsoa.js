let express = require('express')
let app = express()
const PORT = 8088
const { Router } = express
const router = Router()
const routerProd = Router()
const routerCart = Router()
const raiz= Router()
let {Server:HttpServer} = require('http')
let {Server:SocketIO} = require('socket.io');
let cookieParser= require('cookie-parser')
let session = require("express-session"); 
let MongoStore = require("connect-mongo")
let path = require("path");
require("dotenv").config();
const MONGO_ATLAS=process.env.MONGO_URL_ATLAS;
const serverRoutes = require("./routes");

// vistas
// app.set("views", path.join(__dirname, 'views', 'ejs'))
const ejs= require("ejs")
app.set('view engine', 'ejs');
app.set("views","./views/ejs")
// CONECTO CON LA BASE DE DATOS

// let ProductosDB=null;
// let UsuariosDB=null;
// let MensajesDB=null;

// // Elegir la base de datos, con 1: MongoDB, 2: SQL, 3:Firebase
// let opcionDB=3;

// if (opcionDB==1) {
// 	ProductosDB=require('./components/productos/manejadorMongo')
// 	UsuariosDB=require('./components/usuarios/manejadorMongo')
// 	MensajesDB=require('./components/mensajes/manejadorMongoMensajes')
// 	console.log(">>>>>>>>>>>>>> OPCION Mongo");
// } else if (opcionDB==2) {
// 	ProductosDB=require('./components/pruductos/manejadorSQL');
// 	UsuariosDB=require('./components/usuarios/manejadorSQL');
// 	MensajesDB=require('./components/mensajes/manejadorSQLite');
// 	console.log(">>>>>>>>>>>>>> OPCION SQL");
// } else {
// 	ProductosDB= require('./components/pruductos/manejadorFirebase')
// 	UsuariosDB= require('./components/usuarios/manejadorFirebase')
// 	MensajesDB= require('./components/mensajes/manejadorFirebaseMensajes')
// 	console.log(">>>>>>>>>>>>>> OPCION Firebase");
// }

// let misProductos = new ProductosDB("productos");
// let misUsuarios = new UsuariosDB("usuarios");
// let misMensajes = new MensajesDB("mensajes");

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


// app.get('/', (req, res, next)=>{
// 	res.redirect('login');
//     })


// app.get('/login', (req, res, next) => {
// 	// let total = await misProductos.getAll();
// 	req.session.test=7;
// 	req.session.prueba={test: 7};
// 	if (req.session.contador) {
// 		req.session.contador++
// 		console.log(`visitas: ${req.session.contador}`);
// 	} else {
// 		req.session.contador=1
// 		console.log(`bienvenido`);
// 	}
// 		console.log(`Hola, bienvenido`)
// 	res.render('login',{});	
// 	// res.sendFile(__dirname + '/public/login.html');
// })
// let username;
// app.post('/login', (req, res, next) => {
// 	console.log(req.body)
// 	username=req.body
// 	// res.json(req.body)
// 	return res.redirect('home'); // NO TOCARRRRRR !!!!!!!!!!!!!!!!!!!!
// })

// app.get('/home', (req, res, next)=>{
// 	console.log('FUNCA HASTA HOME');
// 	// res.render('home',{username: username});
// 	res.render('home',{username: username.name});
// 	console.log(username);
// 	// res.json({hola: "hola"})
//     })

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


// app.use('/api', router)
// app.use('/api/product', routerProd)
// app.use('/api/cart', routerCart)
// app.use('/', raiz)


httpServer.listen(PORT, ()=>{
	console.log(`Server on!: http://localhost:${PORT}`)
})