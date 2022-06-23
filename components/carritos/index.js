const express = require("express");
const carritoController = require("./controllers/carritoController");
const Autenticacion = require("../../middleware/autenticacion");

module.exports = app => {
    const carritoRouter = express.Router();
    app.use("/", carritoRouter);
    carritoRouter.get("/productos", Autenticacion.usuario, carritoController.getProducts);
    carritoRouter.get("/productos/:id_prod", Autenticacion.usuario, carritoController.getSubProducts);
    carritoRouter.get("/product", Autenticacion.usuario, carritoController.getSubElement);
    carritoRouter.get("/carrito", Autenticacion.usuario, carritoController.getSubElement);
    carritoRouter.post("/carrito", Autenticacion.usuario, carritoController.createSubElement);
    carritoRouter.post("/carrito/:id_prod", Autenticacion.usuario, carritoController.deleteSubElement);
    carritoRouter.post("/", Autenticacion.usuario, carritoController.createElement);
    carritoRouter.post("/product", Autenticacion.usuario, carritoController.createSubElement);
    carritoRouter.delete("/carrito", Autenticacion.usuario, carritoController.deleteElement);
    carritoRouter.delete("/product/:id_prod", Autenticacion.usuario, carritoController.deleteSubElement);
    carritoRouter.get("/chat", Autenticacion.usuario, carritoController.getChat);
}

