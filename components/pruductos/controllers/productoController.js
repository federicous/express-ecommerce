// let ProductosDB=null;

// // Elegir la base de datos, con 1: MongoDB, 2: SQL, 3:Firebase
// let opcionDB="productoService";

// 	ProductosDB=require(`../services/${opcionDB}`)
// 	console.log(`>>>>>>>>>>>>>> OPCION ${opcionDB}`);

const elementService = require('../services')


class Element {

    async createElement(req, res, next){
        try {
            let element = req.body;
            let response = await elementService.save(element);
            res.json(response);
        } catch (error) {
            console.log(error);
        }
    }

    async getElement(req, res, next){
        try {
            //let { id } = req.body;
            let id = req.params.id
            let response = await elementService.getById(id);
            res.json(response);
        } catch (error) {
            console.log(error);
        }
    }

    async getAllElement(req, res, next){
        try {
            let response = await elementService.getAll();
            res.json(response);
        } catch (error) {
            console.log(error);
        }
    }

    async updateElement(req, res, next){
        try {
            let { element } = req.body;
            let id = req.params.id
            let response = await elementService.modify(id, element);
            res.json({
                result:'ok',
                id: req.params.id,
                new: req.body
            })
        } catch (error) {
            console.log(error);
        }
    }

    async deleteElement(req, res, next){
        try {
            // let { id } = req.body;
            let id = req.params.id
            let response = await elementService.deleteById(id);
            // res.json(response);
            res.json({
                result:'ok',
                id: req.params.id      
            })
        } catch (error) {
            console.log(error);
        }
    }

    async deleteAllElement(req, res, next){
        try {
            let response = await elementService.deleteAll();
            res.json(response);
        } catch (error) {
            console.log(error);
        }
    }
}


module.exports = new Element();