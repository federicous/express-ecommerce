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
			// const verification = await JWT.verify(token)
			// if (!verification) return res.status(401).render('authError')
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
            pino.error(`Se produjo un error: ${error}`);
        }
    }


    async getHome(req, res, next){
        try {
            res.render('home',{username: req.session.username});
        } catch (error) {
            pino.error(`Se produjo un error: ${error}`);
        }
    }

    async getLogout(req, res, next){
        try {
            res.status(200).clearCookie('token').render('login',{message: ''})
        } catch (error) {
            pino.error(`Se produjo un error: ${error}`);
        }
    }

    async getRegister(req, res, next){
        try {
            res.render('register',{message: ''});	
        } catch (error) {
            pino.error(`Se produjo un error: ${error}`);
        }
    }

    async postRegister(req, res, next){
        try {
            const token = req.cookies.token;
            // let payload = await JWT.decode(token)
            let element = req.body;
            let response = await elementService.createUser(element);
            if (response.message) {
                // pino.info(response);
                return res.status(404)
                .render('register', {message: response.message});
            }
            await Nodemailer.registro(response);
            res.status(200)
            // .cookie('token', response.token, {maxAge: 3600000})
            .redirect('/login');
            
        } catch (error) {
            pino.error(`Se produjo un error: ${error}`);
        }
    }

    async getVerProductos(req, res, next){
        try {
            const token = req.cookies.token
            let payload = await JWT.decode(token)
            let carritoId = await carritoService.save(payload);
            let productos = await productService.getAll();
            res.render('verProductos',{message: '',productos, carritoId});	
        } catch (error) {
            pino.error(`Se produjo un error: ${error}`);
        }
    }

}

module.exports = new Element();