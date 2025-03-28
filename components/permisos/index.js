const express = require("express");
const permisosController = require("./controllers/permisosController");
const Autenticacion = require("../../middleware/autenticacion");

module.exports = app => {
    const permisosRouter = express.Router();
    app.use("/permisos", permisosRouter);
    permisosRouter.get("/nivel",Autenticacion.usuario, permisosController.getPermiso);
    permisosRouter.get("/descuento",Autenticacion.usuario, permisosController.getPermiso);
    permisosRouter.get("/vende", permisosController.getVende); // Sin autenticación
}

