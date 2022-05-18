const express = require("express");
const authController = require("./controllers/authController");
const Autenticacion = require("../../middleware/autenticacion");

module.exports = app => {
    const authRouter = express.Router();
    app.use("/", authRouter);
    authRouter.get("/login", authController.getLogin);
    authRouter.post("/login", authController.postLogin);
    authRouter.get("/home", Autenticacion.usuario, authController.getHome);
    authRouter.post("/logout", authController.postLogout);
    authRouter.get("/register", authController.getRegister);
    authRouter.post("/register", authController.postRegister);

    // authRouter.get("/", authController.getAllElement);
    // authRouter.get("/:id", authController.getElement);
    // authRouter.post("/", authController.createElement);
    // authRouter.put("/:id", authController.updateElement);
    // authRouter.delete("/:id", authController.deleteElement);
}

