// Elegir la base de datos, con 1: MongoDB, 2: SQL, 3:Firebase
let opcionDB="mongo";

	let CarritoDB=require(`../services/${opcionDB}`)
	console.log(`>>>>>>>>>>>>>> OPCION ${opcionDB}`);

module.exports = new CarritoDB("carrito");
