const express = require("express");
const productoController = require("./controllers/productoController");
const Autenticacion = require("../../middleware/autenticacion");

module.exports = app => {
    const prodRouter = express.Router();
    app.use("/api/product", prodRouter);
    prodRouter.get("/", Autenticacion.usuario ,productoController.getAllElement);
    prodRouter.get("/:id", Autenticacion.usuario, productoController.getElement);
    prodRouter.post("/", Autenticacion.administrador, productoController.createElement);
    prodRouter.put("/:id", Autenticacion.administrador, productoController.updateElement);
    prodRouter.delete("/:id", Autenticacion.administrador, productoController.deleteElement);
    prodRouter.delete("/", Autenticacion.administrador, productoController.deleteAllElement);
}

