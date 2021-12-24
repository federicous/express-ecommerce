const {mysqlConfig} = require('./config/mysqlDB');
let Contenedor=require('./public/manejadorDocumentosSQL');
const knex = require('knex')(mysqlConfig);
let express = require('express')
let app = express()
const PORT = 8088
const { Router } = express
const router = Router()
const routerProd = Router()
const routerCart = Router()

let misProductos = new Contenedor('mysqlConfig');

(async()=>{
	try {
		let exists= await knex.schema.hasTable('productos');
		if (!exists) {
			await knex.schema.createTable('productos', table => {
				table.increments('id')
				table.string('name')
				table.integer('stock')
				table.float('price')
				table.string('description')
				table.string('image')
				table.timestamp('created_at').defaultTo(knex.fn.now())
				table.uuid('uuid')
		});	  
		await addProduct();
		} else {
			console.log("ya existe");
		}
      	} catch (error){
		console.log(error);
	}
})();


async function addProduct (){
	let agregar= await knex('productos')
	.insert({
		name: "cocina",
		stock: 8,
		price: 400,
		description: "con horno y encendido eléctrico",
		image: "http://imagen.com/cocina"
	})
	console.log("datos insertados")

	let mostrar = await knex.from('productos').select('*');
	for (const row of mostrar) {
		console.log(`${row['id']} ${row['name']}`);	
	}
};

app.use('/api', router)
app.use('/api/product', routerProd)
app.use('/api/cart', routerCart)

app.listen(PORT, () => {
   console.log(`Servidor http escuchando en http://localhost:${PORT}`)
})
