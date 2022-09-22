const express = require("express");
const usuarioController = require("./controllers/usuarioController");
const Autenticacion = require("../../middleware/autenticacion");

module.exports = app => {
    const userRouter = express.Router();
    app.use("/api/users", userRouter);
    userRouter.get("/", Autenticacion.administrador, usuarioController.getAllElement);
    userRouter.get("/:id", Autenticacion.administrador, usuarioController.getElement);
    userRouter.post("/", Autenticacion.administrador, usuarioController.createElement);
    userRouter.put("/:id", Autenticacion.administrador, usuarioController.updateElement);
    userRouter.delete("/:id", Autenticacion.administrador, usuarioController.deleteElement);
}

