const express = require("express");
const descargasController = require("./controllers/descargasController");
const Autenticacion = require("../../middleware/autenticacion");
const upload = require("../../utils/multer")

module.exports = app => {
    const descargasRouter = express.Router();
    app.use("/descargas", descargasRouter);
    descargasRouter.get("/lista/:archivo", Autenticacion.usuario, descargasController.getFile);
    descargasRouter.get("/lista", Autenticacion.usuario, descargasController.getFileList);
    // descargasRouter.post("/login", descargasController.postLogin);
    // descargasRouter.get("/home", Autenticacion.usuario, descargasController.getHome);
    // descargasRouter.get("/logout", descargasController.getLogout);
    // descargasRouter.get("/register", descargasController.getRegister);
    // descargasRouter.post("/register", upload.single('myFile'), descargasController.postRegister);
    // descargasRouter.get("/verProductos", Autenticacion.usuario, descargasController.getVerProductos);
    // descargasRouter.post("/upload", upload.single('myFile'), descargasController.postUpload);
}

