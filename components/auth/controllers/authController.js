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
            req.session.username=credenciales.name;
            console.log(credenciales)
            return res.redirect('home');
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
            req.session.destroy
            return res.redirect('login');
        } catch (error) {
            console.log(error);
        }
    }
}


module.exports = new Element();