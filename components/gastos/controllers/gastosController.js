const elementService = require('../services');
const pino = require('../../../utils/logger/pino');
const managementCreate = require('../../../utils/managementCreate');
const managementList = require('../../../utils/managementList');

const expenseEdit = require('../../../utils/managementLinkedInvoice')(
  require('../../../schema/gastos'), { exists: async () => false }, 'gasto');

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

    async updateElement(req, res){
        return expenseEdit.updateById(req, res);
    }

    async updateAllElement(req, res){
        return expenseEdit.updateRoot(req, res);
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
            let id = req.params.id
            let response = await elementService.deleteById(id);
            res.status(200).json({
                result:'ok',
                id: req.params.id      
            })
        } catch (error) {
            pino.error(`Se produjo un error: ${error}`);
            res.status(400).render('error');
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
