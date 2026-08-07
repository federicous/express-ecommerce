const express = require("express");
const searchController = require("./controllers/searchController");
const Autenticacion = require("../../middleware/autenticacion");

module.exports = app => {
    const searchRouter = express.Router();
    app.use("/api/search", searchRouter);
    searchRouter.get("/:patron", searchController.getAllNames);
    searchRouter.get("/", searchController.getAllElement);

}

