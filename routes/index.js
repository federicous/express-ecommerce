const apiProductos = require("../components/pruductos");
const apiProducts = require("../components/pruducts");
const apiTekbond = require("../components/tekbond");
const apiCarritos = require("../components/carritos");
const apiCart = require("../components/carritosApi");
const apiUsuarios = require("../components/usuarios");
const apiOrdenes = require("../components/ordenes");
const apiAuth = require("../components/auth");
const apiCategorias = require("../components/categorias");
const apiListas = require("../components/listas");
const apiSearch = require("../components/search");
const apiPermisos = require("../components/permisos");
const apiDescuento = require("../components/descuento");
// const apiDolar = require("../components/dolar");
const apiDolarAutomatico = require("../components/dolarAutomatico");
const apiOfertas = require("../components/ofertas");
const apiNovedades = require("../components/novedades");
const apiDescargas = require("../components/descargas");
const apiPromo = require("../components/promo");
const apiFacturaCliente = require("../components/facturaCliente");
const apiCobroCliente = require("../components/cobroCliente");
const apiDevoluciones = require("../components/devoluciones");
const apiPendientes = require("../components/pendientes");
const apiCheques = require("../components/cheques");
const apiFacturaProveedor = require("../components/facturaProveedor");
const apiPagos = require("../components/pagos");
const apiGastos = require("../components/gastos");
const health = require("./health");
const session = require("./session");
const Autenticacion = require("../middleware/autenticacion");
const clientConfig = require("../config/client");
const { createManagementOptionsHandler } = require('./managementOptions');
const { createAttemptRecoveryHandler } = require('./managementAttemptRecovery');



const apiConfiguracion = require("../components/configuracion");

function serverRoutes(app) {
    require("./retiredMessaging")(app);
    app.get("/health", health);
    const { mongoose } = require("../config/mongo");
    const { createReadinessHandler } = require("./readiness");
    app.get("/ready", createReadinessHandler({ connection: mongoose.connection, managementEnabled: clientConfig.featureManagement }));
    app.get("/api/auth/session", Autenticacion.usuario, session);
    apiConfiguracion(app);
    apiProductos(app);
    apiProducts(app);
    apiTekbond(app);
    apiCarritos(app);
    apiCart(app);
    apiUsuarios(app);
    apiAuth(app);
    apiOrdenes(app);
    apiCategorias(app);
    apiListas(app);
    apiSearch(app);
    apiPermisos(app);
    apiDescuento(app);
    // apiDolar(app);
    apiDolarAutomatico(app);
    apiOfertas(app);
    apiNovedades(app);
    apiDescargas(app);
    apiPromo(app);
    // La interfaz independiente no habilita estas APIs por sí sola.
    // Cada instancia debe optar explícitamente por gestión en su backend.
    if (clientConfig.featureManagement) {
        app.get('/api/management/options', Autenticacion.administrador, createManagementOptionsHandler());
        app.get('/api/management/attempts/:resource/:key', Autenticacion.administrador, createAttemptRecoveryHandler());
        apiFacturaCliente(app);
        apiCobroCliente(app);
        apiDevoluciones(app);
        apiPendientes(app);
        apiCheques(app);
        apiFacturaProveedor(app);
        apiPagos(app);
        apiGastos(app);
    }
    
    app.get("/", (req, res, next)=>{
        res.redirect('login');
        // res.send("ok");
    });
}

module.exports = serverRoutes;
