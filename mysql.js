const {mysqlConfig} = require('./config/mysqlDB')
const knex = require('knex')(mysqlConfig);

knex.schema.createTable('productos', table => {
	table.increments('id')
	table.string('name')
	table.integer('stock')
	table.float('price')
	table.string('description')
	table.string('image')
	table.timestamp('created_at').defaultTo(knex.fn.now())
	table.uuid('uuid')
})
.then(()=> console.log("tabla creada"))
.catch((err)=>{console.log(err); throw err})
.finally(()=>{knex.destroy()})