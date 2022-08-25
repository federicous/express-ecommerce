const express = require("express");
const listaController = require("./controllers/listaController");
const Autenticacion = require("../../middleware/autenticacion");

module.exports = app => {
    const lista = express.Router();
    app.use("/api/listas", lista);
    lista.get("/:id", Autenticacion.usuario ,listaController.getElement);
    lista.get("/", Autenticacion.usuario ,listaController.getElement);
    lista.get("/:lista/:id", Autenticacion.usuario ,listaController.getElementLista);

}

