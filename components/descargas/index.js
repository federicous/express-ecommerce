const express = require("express");
const descargasController = require("./controllers/descargasController");
const Autenticacion = require("../../middleware/autenticacion");
const upload = require("../../utils/multer/descargas")

module.exports = app => {
    const descargasRouter = express.Router();
    app.use("/api/descargas", descargasRouter);
    descargasRouter.get("/lista/:archivo", Autenticacion.usuario, descargasController.getFile);
    descargasRouter.get("/lista", Autenticacion.usuario, descargasController.getFileList);
    descargasRouter.delete("/lista/:archivo", Autenticacion.administrador, descargasController.deleteFile);
    descargasRouter.post("/lista", Autenticacion.administrador, upload.single('lista'), descargasController.uploadList);
}

