const express = require("express");
const searchController = require("./controllers/searchController");
const Autenticacion = require("../../middleware/autenticacion");

module.exports = app => {
    const searchRouter = express.Router();
    app.use("/api/search", searchRouter);
    searchRouter.get("/:patron", Autenticacion.usuario, searchController.getAllNames);
    searchRouter.get("/", Autenticacion.usuario, searchController.getAllElement);

}

