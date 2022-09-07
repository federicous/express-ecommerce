const express = require("express");
const ordenController = require("./controllers/ordenController");
const Autenticacion = require("../../middleware/autenticacion");

module.exports = app => {
    const ordenRouter = express.Router();
    app.use("/api/order", ordenRouter);
    ordenRouter.get("/", Autenticacion.administrador, ordenController.getAllElement);
    ordenRouter.get("/id/:id", Autenticacion.administrador, ordenController.getElement);
    ordenRouter.get("/user", Autenticacion.usuario, ordenController.getAllElementUser);
    ordenRouter.post("/", Autenticacion.administrador, ordenController.createElement);
    ordenRouter.delete("/:id", Autenticacion.administrador, ordenController.deleteElement);
}

