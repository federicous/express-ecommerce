const apiProductos = require("../components/pruductos");
const apiCarritos = require("../components/carritos");
const apiMensajes = require("../components/mensajes");
const apiUsuarios = require("../components/usuarios");
const apiAuth = require("../components/auth");

function serverRoutes(app) {
    apiProductos(app);
    apiCarritos(app);
    apiMensajes(app);
    apiUsuarios(app);
    apiAuth(app);

    app.get("/", (req, res, next)=>{
        res.redirect('login');
        // res.send("ok");
    });
}

module.exports = serverRoutes;