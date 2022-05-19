const elementService = require('../services/authService')
// const jwt = require("jsonwebtoken")
const JWT = require("../../../utils/jwt/jwt")

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
            console.log(token);
            if (!verification) {
                console.log(`sin token`);
                return res.status(200).render('login',{message: ""})
            } else {
                console.log(`con token`);
                res.status(200).redirect('/home')
            }
        } catch (error) {
            console.log(error);
        }
    }

    async postLogin(req, res, next){
        try {
            let {email, password} = req.body;
            console.log(email);
            console.log(password);
            let response = await elementService.login(email,password);
            if (response.message) {
                console.log(response);
                return res.status(404)
                .render('login', {message: response.message});
            }
            res.status(200)
            .cookie('token', response.token, {maxAge: 3600000})
            .redirect('/home');

        } catch (error) {
            console.log(error);
        }
    }


    async getHome(req, res, next){
        try {
            res.render('home',{username: req.session.username});
        } catch (error) {
            console.log(error);
        }
    }

    async getLogout(req, res, next){
        try {
            res.status(200).clearCookie('token').render('login',{message: ''})
        } catch (error) {
            console.log(error);
        }
    }

    async getRegister(req, res, next){
        try {
            res.render('register',{message: ''});	
        } catch (error) {
            console.log(error);
        }
    }

    async postRegister(req, res, next){
        try {
            let element = req.body;
            let response = await elementService.createUser(element);
            if (response.message) {
                console.log(response);
                return res.status(404)
                .render('register', {message: response.message});
            }
            res.status(200)
            // .cookie('token', response.token, {maxAge: 3600000})
            .redirect('/login');
            
        } catch (error) {
            console.log(error);
        }
    }

    async getVerProductos(req, res, next){
        try {
            res.render('verProductos',{message: ''});	
        } catch (error) {
            console.log(error);
        }
    }

}

module.exports = new Element();