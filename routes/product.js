
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

	module.exports= ;