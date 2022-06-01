const express = require("express");
const carritoController = require("./controllers/carritoController");
const Autenticacion = require("../../middleware/autenticacion");

module.exports = app => {
    const carritoRouter = express.Router();
    app.use("/", carritoRouter);
    // carritoRouter.get("/", Autenticacion.usuario, carritoController.getAllElement);
    carritoRouter.get("/productos", Autenticacion.usuario, carritoController.getProducts);
    carritoRouter.get("/productos/:id_prod", Autenticacion.usuario, carritoController.getSubProducts);
    // carritoRouter.get("/:id", carritoController.getElement);
    carritoRouter.get("/product", Autenticacion.usuario, carritoController.getSubElement);
    carritoRouter.get("/carrito", Autenticacion.usuario, carritoController.getSubElement);
    carritoRouter.post("/carrito", Autenticacion.usuario, carritoController.createSubElement);
    carritoRouter.post("/carrito/:id_prod", Autenticacion.usuario, carritoController.deleteSubElement);
    carritoRouter.post("/", Autenticacion.usuario, carritoController.createElement);
    carritoRouter.post("/product", Autenticacion.usuario, carritoController.createSubElement);
    // carritoRouter.put("/:id", carritoController.updateElement);
    carritoRouter.delete("/carrito", Autenticacion.usuario, carritoController.deleteElement);
    carritoRouter.delete("/product/:id_prod", Autenticacion.usuario, carritoController.deleteSubElement);
}

