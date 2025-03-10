const express = require("express");
const usuarioController = require("./controllers/usuarioController");
const Autenticacion = require("../../middleware/autenticacion");

module.exports = app => {
    const userRouter = express.Router();
    app.use("/api/users", userRouter);
    userRouter.get("/", Autenticacion.administrador, usuarioController.getAllElement);
    userRouter.get("/:id", Autenticacion.administrador, usuarioController.getElement);
    // userRouter.post("/", Autenticacion.administrador, usuarioController.createElement);
    userRouter.post("/", Autenticacion.administrador, usuarioController.postRegister);
    userRouter.put("/", Autenticacion.administrador, usuarioController.updateElement);
    userRouter.delete("/", Autenticacion.administrador, usuarioController.deleteRegister);
}

