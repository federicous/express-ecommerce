const express = require("express");
const permisosController = require("./controllers/permisosController");
const Autenticacion = require("../../middleware/autenticacion");

module.exports = app => {
    const permisosRouter = express.Router();
    app.use("/permisos", permisosRouter);
    permisosRouter.get("/",Autenticacion.usuario, permisosController.getPermiso);
}

