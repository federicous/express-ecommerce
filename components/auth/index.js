const express = require("express");
const authController = require("./controllers/authController");
const Autenticacion = require("../../middleware/autenticacion");
const upload = require("../../utils/multer")

module.exports = app => {
    const authRouter = express.Router();
    app.use("/", authRouter);
    authRouter.get("/login", authController.getLogin);
    authRouter.post("/login", authController.postLogin);
    authRouter.post("/api/auth/browser-logout", authController.postBrowserLogout);
    authRouter.get("/api/auth/admin/session", Autenticacion.administrador, require("../../routes/session"));
    authRouter.get("/home", Autenticacion.usuario, authController.getHome);
    authRouter.get("/logout", authController.getLogout);
    authRouter.get("/register", authController.getRegister);
    authRouter.post("/register", upload.single('myFile'), authController.postRegister);
    authRouter.get("/verProductos", Autenticacion.usuario, authController.getVerProductos);
    authRouter.post("/upload", Autenticacion.administrador, upload.single('myFile'), authController.postUpload);
}

