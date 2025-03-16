const elementService = require('../services')
const pino = require('../../../utils/logger/pino')

class Element {

    // async createElement(req, res, next){
    //     try {
    //         let element = req.body;
    //         let response = await elementService.save(element);
    //         res.status(200).json(response);
    //     } catch (error) {
    //         pino.error(`Se produjo un error: ${error}`);
    //         res.status(400).render('error');
    //     }
    // }

    async postRegister(req, res, next){
        try {
            // const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
            // // res.send(req.file)
            // console.log(req.file.filename);
            // console.log(req.body.email);
            let avatar = req.file ? req.file.filename : "avatar-generico.jpg";
            let element = req.body;
            let response = await elementService.createUser(element,avatar);
            // if (response.message) {
            //     return res.status(404)
            //     .render('register', {message: response.message});
            // }
            // await Nodemailer.registro(response);
            pino.info(`Registrando Usuario: ${element.email} - endpoint: ${req.baseUrl} [${req.method}]`) 
            res.status(200).json({
                result:'ok',
                new: req.body,
                message: response.message,
            })
            // .redirect('/login');
            
        } catch (error) {
            pino.error(`Se produjo un error: ${error}`)
            res.status(400).render('error');
        }
    }

    async deleteRegister(req, res, next){
        try {
            // const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
            // // res.send(req.file)
            // console.log(req.file.filename);
            // console.log(req.body.email);
            // let avatar = req.file ? req.file.filename : "avatar-generico.jpg";
            let element = req.body;
            let response = await elementService.deleteUser(element);
            // if (response.message) {
            //     return res.status(404)
            //     .render('register', {message: response.message});
            // }
            // await Nodemailer.registro(response);
            pino.info(`Borrando Usuario: ${element.email} - endpoint: ${req.baseUrl} [${req.method}]`) 
            res.status(200).json({
                result:'ok',
                new: req.body,
                message: response.message,
            })
            // .redirect('/login');
            
        } catch (error) {
            pino.error(`Se produjo un error: ${error}`)
            res.status(400).render('error');
        }
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
        try {
            let response = await elementService.getAll();
            res.status(200).json(response);
        } catch (error) {
            pino.error(`Se produjo un error: ${error}`);
            res.status(400).render('error');
        }
    }

    async updateElement(req, res, next){
        try {
            let element = req.body;
            console.log(`body:`);
            console.log(element);
            // pino.info(`request: ${req.originalUrl} [${req.method}] - body: ${req.body}`)                    

            // let email = req.params.email
            // let email = element.email
            // console.log(element);
            // console.log(email);
            // return
            pino.info(`Modificando Usuario: ${element.email ? element.email : element._id} - endpoint: ${req.baseUrl} [${req.method}]`)                    
            let response = await elementService.modifyUser(element);
            res.status(200).json({
                result:'ok',
                new: req.body,
                message: response.message,
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
