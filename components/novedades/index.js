const express = require("express");
const novedadesController = require("./controllers/novedadesController");
const Autenticacion = require("../../middleware/autenticacion");
const upload = require("../../utils/multer");

module.exports = app => {
    const novedadRouter = express.Router();
    app.use("/api/novedades", novedadRouter);
    novedadRouter.get("/", Autenticacion.usuario ,novedadesController.getAllElement);
    // novedadesRouter.get("/category/:category", Autenticacion.usuario ,novedadesController.getAllElementCategory);
    // novedadesRouter.get("/brand/:lista", Autenticacion.usuario ,novedadesController.getAllElementLista);
    // novedadesRouter.get("/:lista/category/:category", Autenticacion.usuario ,novedadesController.getAllElementCategoryLista);
    // novedadesRouter.get("/:id", Autenticacion.usuario, novedadesController.getElement);
}

