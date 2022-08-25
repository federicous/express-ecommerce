// const elementService = require('../../pruductos/services');
const elementService = require('../services');
const pino = require('../../../utils/logger/pino');

class Element {

    async getElement(req, res, next){
        try {
            // let datos;
            let identificador = req.params.id
            const categorias = [];
            let response = await elementService.getAll(identificador);
            for (let prod = 0; prod < response.length; prod++) {
                const element = response[prod];
                // console.log(element);
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

    async getElementLista(req, res, next){
        try {
            // let datos;
            let identificador = req.params.id
            let lista = req.params.lista
            const categorias = [];
            let response = await elementService.getAllLista(identificador,lista);
            for (let prod = 0; prod < response.length; prod++) {
                // const element = response[prod];
                // console.log(element);
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