const elementService = require('../services')
const pino = require('../../../utils/logger/pino')
const { publicUser } = require('../services/publicUser');

class Element {

    // async createElement(req, res, next){
    //     try {
    //         let element = req.body;
    //         let response = await elementService.save(element);
    //         res.status(200).json(Array.isArray(response) ? response.map(publicUser) : publicUser(response));
    //     } catch (error) {
    //         pino.error('Error en operación de usuarios');
    //         res.status(error.status || 500).json({ ...(error.code ? { code: error.code } : {}), message: error.status ? error.message : 'No se pudo completar la operación de usuarios' });
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
                new: publicUser(response.user || response),
                message: response.message,
            })
            // .redirect('/login');
            
        } catch (error) {
            pino.error('Error en operación de usuarios')
            res.status(error.status || 500).json({ ...(error.code ? { code: error.code } : {}), message: error.status ? error.message : 'No se pudo completar la operación de usuarios' });
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
                new: { _id: element._id },
                message: response.message,
            })
            // .redirect('/login');
            
        } catch (error) {
            pino.error('Error en operación de usuarios')
            res.status(error.status || 500).json({ ...(error.code ? { code: error.code } : {}), message: error.status ? error.message : 'No se pudo completar la operación de usuarios' });
        }
    }

    async getElement(req, res, next){
        try {
            let id = req.params.id
            let response = await elementService.getById(id);
            res.status(200).json(Array.isArray(response) ? response.map(publicUser) : publicUser(response));
        } catch (error) {
            pino.error('Error en operación de usuarios');
            res.status(error.status || 500).json({ ...(error.code ? { code: error.code } : {}), message: error.status ? error.message : 'No se pudo completar la operación de usuarios' });
        }
    }


    async getElementIdVendedor(req, res, next){
        try {
            let id = req.params.idVendedor
            let response = await elementService.getByIdVendedor(id);
            res.status(200).json(Array.isArray(response) ? response.map(publicUser) : publicUser(response));
        } catch (error) {
            pino.error('Error en operación de usuarios');
            res.status(error.status || 500).json({ ...(error.code ? { code: error.code } : {}), message: error.status ? error.message : 'No se pudo completar la operación de usuarios' });
        }
    }


    async getAllElement(req, res, next){
        try {
            let response = await elementService.getAll();
            res.status(200).json(Array.isArray(response) ? response.map(publicUser) : publicUser(response));
        } catch (error) {
            pino.error('Error en operación de usuarios');
            res.status(error.status || 500).json({ ...(error.code ? { code: error.code } : {}), message: error.status ? error.message : 'No se pudo completar la operación de usuarios' });
        }
    }

    async updateElement(req, res, next){
        try {
            let element = req.body;
            pino.info('Solicitud de modificación de usuario');
            let response = await elementService.modifyUser(element);
            res.status(200).json({
                result:'ok',
                new: publicUser(response.user || element),
                message: response.message,
            })
        } catch (error) {
            pino.error('Error en operación de usuarios');
            res.status(error.status || 500).json({ ...(error.code ? { code: error.code } : {}), message: error.status ? error.message : 'No se pudo completar la operación de usuarios' });
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
            pino.error('Error en operación de usuarios');
            res.status(error.status || 500).json({ ...(error.code ? { code: error.code } : {}), message: error.status ? error.message : 'No se pudo completar la operación de usuarios' });
        }
    }

    async deleteAllElement(req, res, next){
        try {
            let response = await elementService.deleteAll();
            res.status(200).json(Array.isArray(response) ? response.map(publicUser) : publicUser(response));
        } catch (error) {
            pino.error('Error en operación de usuarios');
            res.status(error.status || 500).json({ ...(error.code ? { code: error.code } : {}), message: error.status ? error.message : 'No se pudo completar la operación de usuarios' });
        }
    }
}


module.exports = new Element();
