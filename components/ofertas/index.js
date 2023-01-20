const express = require("express");
const ofertasController = require("./controllers/ofertasController");
const Autenticacion = require("../../middleware/autenticacion");
const upload = require("../../utils/multer");

module.exports = app => {
    const ofertaRouter = express.Router();
    app.use("/api/ofertas", ofertaRouter);
    ofertaRouter.get("/", Autenticacion.usuario ,ofertasController.getAllElement);
    // ofertaRouter.get("/category/:category", Autenticacion.usuario ,ofertasController.getAllElementCategory);
    // ofertaRouter.get("/brand/:lista", Autenticacion.usuario ,ofertasController.getAllElementLista);
    // ofertaRouter.get("/:lista/category/:category", Autenticacion.usuario ,ofertasController.getAllElementCategoryLista);
    // ofertaRouter.get("/:id", Autenticacion.usuario, ofertasController.getElement);
}

