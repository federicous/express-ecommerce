const express = require("express");
const categoriaController = require("./controllers/categoriaController");
const Autenticacion = require("../../middleware/autenticacion");

module.exports = app => {
    const categoria = express.Router();
    app.use("/api/categorias", categoria);
    categoria.get("/:id", Autenticacion.usuario ,categoriaController.getElement);

}

