const apiProductos = require("../components/pruductos");
const apiProducts = require("../components/pruducts");
const apiCarritos = require("../components/carritos");
const apiCart = require("../components/carritosApi");
const apiMensajes = require("../components/mensajes");
const apiUsuarios = require("../components/usuarios");
const apiOrdenes = require("../components/ordenes");
const apiAuth = require("../components/auth");
const apiCategorias = require("../components/categorias");
const apiSearch = require("../components/search");

function serverRoutes(app) {
    apiProductos(app);
    apiProducts(app);
    apiCarritos(app);
    apiCart(app);
    apiMensajes(app);
    apiUsuarios(app);
    apiAuth(app);
    apiOrdenes(app);
    apiCategorias(app);
    apiSearch(app);

    app.get("/", (req, res, next)=>{
        res.redirect('login');
        // res.send("ok");
    });
}

module.exports = serverRoutes;