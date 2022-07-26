const elementService = require('../../pruductos/services');
const pino = require('../../../utils/logger/pino');
// const carritoService = require('../../carritos/services');
const JWT = require("../../../utils/jwt/jwt");
const categorias = require('..');

class Element {

    async getElement(req, res, next){
        try {
            // let datos;
            let identificador = req.params.id
            const categorias = [];
            let response = await elementService.getAll();
            for (let prod = 0; prod < response.length; prod++) {
                const element = response[prod];
                console.log(element);
                categorias.push(response[prod][identificador])
                
            }

            let uniq = [...new Set(categorias)].sort();
            // datos = JSON.stringify(uniq);
            res.status(200).json(uniq);

        } catch (error) {
            pino.error(`Se produjo un error: ${error}`);
            res.status(400).render('error');
        }
    }

}


module.exports = new Element();