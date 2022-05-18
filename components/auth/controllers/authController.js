const elementService = require('../services')
// const jwt = require("jsonwebtoken")

class Element {

    async getLogin(req, res, next){
        try {
            req.session.test=7;
            req.session.prueba={test: 7};
            if (req.session.contador) {
                req.session.contador++
                console.log(`visitas: ${req.session.contador}`);
            } else {
                req.session.contador=1
                console.log(`bienvenido`);
            }
                console.log(`Hola, bienvenido`)
            res.render('login',{});	
        } catch (error) {
            console.log(error);
        }
    }

    async postLogin(req, res, next){
        try {
            let {email, password} = req.body;
            console.log(email);
            console.log(password);
            let response = await elementService.getByEmail(email,password);
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
            let response = await elementService.save(element);
            res.status(200)
            .cookie('token', response.token, {maxAge: 3600000})
            .redirect('/login');
            
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new Element();