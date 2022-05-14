const elementService = require('../services')

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
            res.render('login3',{});	
        } catch (error) {
            console.log(error);
        }
    }

    async postLogin(req, res, next){
        try {
            console.log(req.body)
            let credenciales=req.body
            console.log(credenciales)
            // res.json(req.body)
            // return res.redirect('home');
            res.render('home',{username: credenciales.name});
        } catch (error) {
            console.log(error);
        }
    }

    async getHome(req, res, next){
        try {
            console.log('FUNCA HASTA HOME');
            // res.render('home',{username: username});
            res.render('home',{username: username.name});
            console.log(username);
            // res.json({hola: "hola"})
        } catch (error) {
            console.log(error);
        }
    }


}


module.exports = new Element();