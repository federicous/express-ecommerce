const express = require("express");
const carritoController = require("./controllers/carritoController");
const Autenticacion = require("../../middleware/autenticacion");

module.exports = app => {
    const carritoRouter = express.Router();
    app.use("/api/cart", carritoRouter);
    carritoRouter.get("/", Autenticacion.usuario, carritoController.getAllElement);
    // carritoRouter.get("/:id", carritoController.getElement);
    carritoRouter.get("/:id/product", Autenticacion.usuario, carritoController.getSubElement);
    carritoRouter.post("/", Autenticacion.usuario, carritoController.createElement);
    carritoRouter.post("/:id/product", Autenticacion.usuario, carritoController.createSubElement);
    // carritoRouter.put("/:id", carritoController.updateElement);
    carritoRouter.delete("/:id", Autenticacion.usuario, carritoController.deleteElement);
    carritoRouter.delete("/:id/product/:id_prod", Autenticacion.usuario, carritoController.deleteSubElement);
}

