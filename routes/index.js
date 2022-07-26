const apiProductos = require("../components/pruductos");
const apiProducts = require("../components/pruducts");
const apiCarritos = require("../components/carritos");
const apiMensajes = require("../components/mensajes");
const apiUsuarios = require("../components/usuarios");
const apiOrdenes = require("../components/ordenes");
const apiAuth = require("../components/auth");
const apiCategorias = require("../components/categorias");

function serverRoutes(app) {
    apiProductos(app);
    apiProducts(app);
    apiCarritos(app);
    apiMensajes(app);
    apiUsuarios(app);
    apiAuth(app);
    apiOrdenes(app);
    apiCategorias(app);

    app.get("/", (req, res, next)=>{
        res.redirect('login');
        // res.send("ok");
    });
}

module.exports = serverRoutes;