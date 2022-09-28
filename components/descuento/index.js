const express = require("express");
const descuentoController = require("./controllers/descuentoController");
const Autenticacion = require("../../middleware/autenticacion");

module.exports = app => {
    const descuentoRouter = express.Router();
    app.use("/descuento/", descuentoRouter);
    descuentoRouter.get("/",Autenticacion.usuario, descuentoController.getDescuento);
}

