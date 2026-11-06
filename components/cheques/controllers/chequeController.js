const elementService = require('../services');
const pino = require('../../../utils/logger/pino');
const managementCreate = require('../../../utils/managementCreate');
const managementList = require('../../../utils/managementList');
const mongoose = require('mongoose');
const Cheque = require('../../../schema/cheques');
const Collection = require('../../../schema/cobroClientes');
const Payment = require('../../../schema/pagos');
const removeCheque = require('../../../utils/managementChequeDelete')(Cheque, Collection, Payment);

class Element {

    async createElement(req, res, next){
        return managementCreate(elementService, req, res);
    }

    async getElement(req, res, next){
        try {
            let id = req.params.id
            let response = await elementService.getById(id);
            res.status(200).json(response);
        } catch (error) {
            pino.error(`Se produjo un error: ${error}`);
            res.status(400).render('error');
        }
    }

    async getAllElement(req, res, next){
        return managementList(elementService, req, res);
    }

    async getAllElementCategory(req, res, next){
        try {
            let page = req.query.page;
            let pageSize = req.query.pageSize
            let category = req.params.category
            let response = await elementService.getAllCategoryPage(category,page,pageSize);
            res.status(200).json(response);

        } catch (error) {
            pino.error(`Se produjo un error: ${error}`);
            res.status(400).render('error');
        }
    }

    async getAllElementCategoryLista(req, res, next){
        try {
            let page = req.query.page;
            let pageSize = req.query.pageSize
            let category = req.params.category
            let lista = req.params.lista
            let response = await elementService.getAllCategoryPageLista(category,page,pageSize,lista);
            res.status(200).json(response);

        } catch (error) {
            pino.error(`Se produjo un error: ${error}`);
            res.status(400).render('error');
        }
    }

    async getAllElementLista(req, res, next){
        try {
            let page = req.query.page;
            let pageSize = req.query.pageSize
            let category = req.params.category
            let lista = req.params.lista
            let response = await elementService.getAllPageLista(category,page,pageSize,lista);
            res.status(200).json(response);

        } catch (error) {
            pino.error(`Se produjo un error: ${error}`);
            res.status(400).render('error');
        }
    }

    async updateElement(req, res, next){
        try {
            let element = req.body;
            let id = req.params.id
            let imageName= req.imageName;
            let response = await elementService.modifyAll(id, element, imageName);
            res.status(200).json({
                result:'ok',
                id: req.params.id,
                new: req.body,
                response: response.message,
            })
        } catch (error) {
            pino.error(`Se produjo un error: ${error}`);
            res.status(400).render('error');
        }
    }

    async updateAllElement(req, res, next){
        try {
            let element = req.body;
            console.log(element);
            let response = await elementService.modifyAll(element);
            res.status(200).json({
                result:'ok',
                new: req.body,
                response: response.resultado,
            })
        } catch (error) {
            pino.error(`Se produjo un error: ${error}`);
            res.status(400).render('error');
        }
    }

    async updateAllElementCode(req, res, next){
        try {
            let element = req.body;
            let imageName= req.imageName;
            let response = await elementService.modifyAllCode(element, imageName);
            res.status(200).json({
                result:'ok',
                new: req.body,
                response: response.resultado,
            })
        } catch (error) {
            pino.error(`Se produjo un error: ${error}`);
            res.status(400).render('error');
        }
    }

    async deleteElement(req, res, next){
        try {
            const id = req.params.id;
            if (typeof id !== 'string' || !/^[a-f\d]{24}$/i.test(id) || !mongoose.isValidObjectId(id)) {
                return res.status(400).json({ error: 'invalid_id', message: 'El identificador no es válido' });
            }
            const outcome = await removeCheque(id);
            const errors = {
                not_found: [404, 'No existe el cheque'],
                linked_cheque: [409, 'El cheque tiene cobros o pagos vinculados'],
                stale_cheque: [409, 'El cheque cambió; recargá la lista'],
                atomicity_unavailable: [503, 'No se puede borrar el cheque: la base necesita soporte transaccional'],
            };
            if (outcome.error) {
                const rejection = errors[outcome.error];
                if (!rejection) throw new Error('No se pudo confirmar el borrado del cheque');
                return res.status(rejection[0]).json({ error: outcome.error, message: rejection[1] });
            }
            return res.status(200).json({
                result:'ok',
                id,
            })
        } catch (error) {
            pino.error(`Se produjo un error: ${error}`);
            return res.status(500).json({ error: 'internal_error', message: 'No se pudo borrar el cheque' });
        }
    }

    async deleteAllElement(req, res, next){
        try {
            let response = await elementService.deleteAll();
            res.status(200).json(response);
        } catch (error) {
            pino.error(`Se produjo un error: ${error}`);
            res.status(400).render('error');
        }
    }
}


module.exports = new Element();
