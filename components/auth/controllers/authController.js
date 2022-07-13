const elementService = require('../services')
// const jwt = require("jsonwebtoken")
const JWT = require("../../../utils/jwt/jwt");
const pino = require('../../../utils/logger/pino');
const productService = require('../../pruductos/services');
const carritoService = require('../../carritos/services');
const Nodemailer = require('../../../utils/nodemailer')

class Element {

    async getLogin(req, res, next){
        try {
            const token = req.cookies.token
            let verification;
            if (token) {
                verification = await JWT.verify(token) 
            }
            pino.info(token);
            if (!verification) {
                pino.info(`sin token`);
                return res.status(200).render('login',{message: ""})
            } else {
                pino.info(`con token`);
                res.status(200).redirect('/productos')
            }
        } catch (error) {
            pino.error(`Se produjo un error: ${error}`);
        }
    }

    async postLogin(req, res, next){
        try {
            let {email, password} = req.body;
            let response = await elementService.login(email,password);
            if (response.message) {
                pino.info(response);
                return res.status(404)
                .render('login', {message: response.message});
            }
            res.status(200)
            .cookie('token', response.token, {maxAge: 3600000})
            .redirect('/productos');

        } catch (error) {
            pino.error(`Se produjo un error: ${error}`)
            res.status(400).render('error');
        }
    }


    async getHome(req, res, next){
        try {
            res.status(200).render('home',{username: req.session.username});
        } catch (error) {
            pino.error(`Se produjo un error: ${error}`)
            res.status(400).render('error');
        }
    }

    async getLogout(req, res, next){
        try {
            res.status(200).clearCookie('token').render('login',{message: ''})
        } catch (error) {
            pino.error(`Se produjo un error: ${error}`)
            res.status(400).render('error');
        }
    }

    async getRegister(req, res, next){
        try {
            res.status(200).render('register',{message: ''});	
        } catch (error) {
            pino.error(`Se produjo un error: ${error}`)
            res.status(400).render('error');
        }
    }

    async postRegister(req, res, next){
        try {
            // const token = req.cookies.token;
            // // res.send(req.file)
            // console.log(req.file.filename);
            // console.log(req.body.email);
            let avatar = req.file.filename ? req.file.filename : "avatar-generico.jpg";
            let element = req.body;
            let response = await elementService.createUser(element,avatar);
            if (response.message) {
                return res.status(404)
                .render('register', {message: response.message});
            }
            await Nodemailer.registro(response);
            res.status(200)
            .redirect('/login');
            
        } catch (error) {
            pino.error(`Se produjo un error: ${error}`)
            res.status(400).render('error');
        }
    }

    async getVerProductos(req, res, next){
        try {
            const token = req.cookies.token
            let payload = await JWT.decode(token)
            let carritoId = await carritoService.save(payload);
            let productos = await productService.getAll();
            res.status(200).render('verProductos',{message: '',productos, carritoId});	
        } catch (error) {
            pino.error(`Se produjo un error: ${error}`)
            res.status(400).render('error');
        }
    }

    async postUpload(req, res, next){
        try {
            const file = req.file;
            if (!file) {
                pino.error(`Por favor subir un archivo`);
                    return res.status(404)
                    .render('register', {message: `Por favor subir un archivo de imgen (.jpg, .png, .jpeg)`});
            }
            res.send(file)

        } catch (error) {
            pino.error(`Se produjo un error: ${error}`);
            res.status(400).render('error');
        }
    }

}

module.exports = new Element();