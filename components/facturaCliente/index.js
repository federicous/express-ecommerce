const express = require("express");
const facturaClienteController = require("./controllers/facturaClienteController");
const Autenticacion = require("../../middleware/autenticacion");
const upload = require("../../utils/multer");

module.exports = app => {
    const facturaClienteRouter = express.Router();
    app.use("/api/facturaCliente", facturaClienteRouter);
    facturaClienteRouter.get("/", Autenticacion.usuario ,facturaClienteController.getAllElement);
    // facturaClienteRouter.get("/category/:category", Autenticacion.usuario ,facturaClienteController.getAllElementCategory);
    // facturaClienteRouter.get("/brand/:lista", Autenticacion.usuario ,facturaClienteController.getAllElementLista);
    // facturaClienteRouter.get("/:lista/category/:category", Autenticacion.usuario ,facturaClienteController.getAllElementCategoryLista);
    // facturaClienteRouter.get("/:id", Autenticacion.usuario, facturaClienteController.getElement);
    facturaClienteRouter.post("/", Autenticacion.administrador, upload.single('image'), facturaClienteController.createElement);
    // facturaClienteRouter.post("/code", Autenticacion.administrador, upload.single('image'), facturaClienteController.updateAllElementCode);
    // // facturaClienteRouter.put("/:id", Autenticacion.administrador, upload.single('myFile'), facturaClienteController.updateElement);
    // // facturaClienteRouter.put("/", Autenticacion.administrador, upload.single('myFile'), facturaClienteController.updateAllElement);
    // facturaClienteRouter.put("/:id", Autenticacion.administrador, upload.single('image'), facturaClienteController.updateElement);
    facturaClienteRouter.put("/", Autenticacion.administrador, upload.single('image'), facturaClienteController.updateAllElement);
    // facturaClienteRouter.delete("/:id", Autenticacion.administrador, facturaClienteController.deleteElement);
    // facturaClienteRouter.delete("/delete/all", Autenticacion.administrador, facturaClienteController.deleteAllElement);
}

