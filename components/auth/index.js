const express = require("express");
const authController = require("./controllers/authController");
const Autenticacion = require("../../middleware/autenticacion");

module.exports = app => {
    const authRouter = express.Router();
    app.use("/", authRouter);
    authRouter.get("/login", authController.getLogin);
    authRouter.post("/login", authController.postLogin);
    authRouter.get("/home", Autenticacion.usuario, authController.getHome);
    authRouter.get("/logout", authController.getLogout);
    authRouter.get("/register", authController.getRegister);
    authRouter.post("/register", authController.postRegister);
    authRouter.get("/verProductos", Autenticacion.usuario, authController.getVerProductos);

}

