const elementService = require('../services/authService')
// const jwt = require("jsonwebtoken")
const JWT = require("../../../utils/jwt/jwt")

class Element {

    async getLogin(req, res, next){
        try {
            const token = req.cookies.token
			const verification = await JWT.verify(token)
			// if (!verification) return res.status(401).render('authError')
            console.log(token);
            if (!verification) {
                console.log(`sin token`);
                return res.status(200).render('login')
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
            let response = await elementService.logout(email,password);
            req.session.destroy
            return res.redirect('login');
        } catch (error) {
            console.log(error);
        }
    }

    async postLogout(req, res, next){
        try {
            req.session.destroy
            return res.redirect('login');
        } catch (error) {
            console.log(error);
        }
    }

    async getRegister(req, res, next){
        try {

            res.render('register',{});	


            // const { nombre, password, direccion } = req.body
            // const yaExiste = usuarios.find(usuario => usuario.nombre == nombre)
            // if (yaExiste) {
            //     return res.json({ error: 'ya existe ese usuario' });
            // }
            // const usuario = { nombre, password, direccion }
            // usuarios.push(usuario)
            // const access_token = generateToken(usuario)
            // res.json({ access_token })

        } catch (error) {
            console.log(error);
        }
    }

    async postRegister(req, res, next){
        try {
            let element = req.body;
            let response = await elementService.createUser(element);
            res.status(200)
            .cookie('token', response.token, {maxAge: 3600000})
            .redirect('/login');
            
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new Element();