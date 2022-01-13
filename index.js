// let Contenedor=require('./public/manejadorSQL');
// let SQLite=require('./public/manejadorSQLite');
let MongoDB=require('./public/manejadorMongo')
let MongoDBMensajes=require('./public/manejadorMongoMensajes')
let express = require('express')
let app = express()
const PORT = 8088
const { Router } = express
const router = Router()
const routerProd = Router()
const routerCart = Router()
let {Server:HttpServer} = require('http')
let {Server:SocketIO} = require('socket.io');

// CONECTO CON LA BASE DE DATOS
// let misProductos = new Contenedor();
// let misMensajes = new SQLite();
let misProductos = new MongoDB("produtos");
let misMensajes = new MongoDBMensajes("mensajes");

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

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("./public"));

app.get('/', async (req, res) => {
let total= await misProductos.getAll();
res.sendFile(__dirname + '/public/index.html');
})


/* ############################## Product ###################################### */
// ----------- GET ---------------
routerProd.get('/', async (req, res, next) => {
let total= await misProductos.getAll();
res.json(total)
})
// ----------- GET ID---------------
routerProd.get('/:id', async (req, res) => {
console.log(req.params.id);
// let resultado= await misProductos.getById(parseInt(req.params.id))
let resultado= await misProductos.getById(req.params.id)
console.log(resultado);
	res.json(resultado)
})
// ----------- POST ---------------
routerProd.post('/', acceso.isAdmin, async (req, res, next) => {
console.log(req.body)
let resultado= await misProductos.save(req.body)

let total= await misProductos.getAll();
res.json(total)
})
// ----------- PUT ---------------
routerProd.put('/:id', acceso.isAdmin, async (req, res, next) => {
// await misProductos.deleteById(req.params.id);
// await misProductos.save(req.body, req.params.id)
await misProductos.modify(req.body, req.params.id)
res.json({
	result:'ok',
	id: req.params.id,
	new: req.body
})
})
// ----------- DELETE ---------------
routerProd.delete('/:id', acceso.isAdmin, async (req, res, next) => {
console.log(req.params.id);
await misProductos.deleteById(req.params.id);
res.json({
	result:'ok',
	id: req.params.id      
})
})
/* ############################## Fin Product ###################################### */

/* ############################## Cart ###################################### */
// ----------- GET ---------------
routerCart.get('/', async (req, res, next) => {
let total= await misCarritos.getAll();
res.json(total)
})
// ----------- GET ID ---------------
routerCart.get('/:id', async (req, res) => {
console.log(req.params.id);
let resultado= await misCarritos.getById(parseInt(req.params.id))
console.log(resultado);
	res.json(resultado)
})
// ----------- POST ---------------
routerCart.post('/', async (req, res, next) => {
if (req.body.length) { // Si envio productos los incluyo al crear el carrito
	let cartToSave= {
	cartList: req.body
	}
	await misCarritos.save(cartToSave)
} else {
	let cartToSave= {
	cartList: []
	}
	await misCarritos.save(cartToSave)
}

	let total= await misCarritos.getAll();
	res.json({id: total[total.length - 1].id})
	console.log(`Id del pedido: ${total[total.length - 1].id}`);
})
// ----------- POST Producto---------------
routerCart.post('/:id/product', async (req, res, next) => {
let cart= await misCarritos.getById(parseInt(req.params.id))
let aux=cart
console.log(aux);
// traigo el producto con id = id_prod
let productAdd = await misProductos.getById(parseInt(req.body.id_prod))

aux.cartList.push(productAdd)
// borro el carrito original
await misCarritos.deleteById(req.params.id);
// guardo el carrito modificado
await misCarritos.save(aux, req.params.id)

res.json({
	result:'ok',
	id: req.params.id      
})

})
// ----------- PUT ---------------
routerCart.put('/:id', async (req, res, next) => {
await misCarritos.deleteById(req.params.id);
await misCarritos.save(req.body, req.params.id)
res.json({
	result:'ok',
	id: req.params.id,
	new: req.body
})
})
// ----------- DELETE Cart---------------
routerCart.delete('/:id', async (req, res, next) => {
console.log(req.params.id);
await misCarritos.deleteById(req.params.id);
res.json({
	result:'ok',
	id: req.params.id      
})
})
// ----------- DELETE Product from Cart---------------
routerCart.delete('/:id/product/:id_prod', async (req, res, next) => {
// console.log(`id cart: ${req.params.id}`);
// console.log(`id producto: ${req.params.id_prod}`);
let cart= await misCarritos.getById(parseInt(req.params.id))
// console.log(`cart a modificar: ${JSON.stringify(cart)}`);
let aux=cart
// console.log(`aux.cartList: ${JSON.stringify(aux.cartList)}`);
// console.log(`aux.cartList[${req.params.id_prod}]: ${JSON.stringify(aux.cartList[req.params.id_prod])}`);
let indice=aux.cartList.findIndex(product=>product.id==parseInt(req.params.id_prod))
// console.log(`indice borrar: ${indice}`);
if (indice!=-1) {
	aux.cartList.splice(indice,1)
	// borro el carrito original
	await misCarritos.deleteById(req.params.id);
	// guardo el carrito modificado
	await misCarritos.save(aux, req.params.id)

	res.json({
	result:'ok',
	id: req.params.id      
	})
}else{
	res.json({
	result:'error',
	id: req.params.id      
	})
}
})
/* ############################## Fin Cart ###################################### */



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


app.use('/api', router)
app.use('/api/product', routerProd)
app.use('/api/cart', routerCart)


httpServer.listen(PORT, ()=>{
	console.log(`Server on!: http://localhost:${PORT}`)
})