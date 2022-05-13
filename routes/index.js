const apiProductos = require("../components/pruductos");
const apiCarritos = require("../components/carritos");
const apiMensajes = require("../components/mensajes");
const apiRegistro = require("../components/usuarios");
const apiMensajes = require("../components/mensajes");

function serverRoutes(app) {
    apiProductos(app);
    apiCarritos(app);
    apiMensajes(app);

    app.get("/", (req, res, next)=>{
        res.send("ok");
    });
}

module.exports = serverRoutes;