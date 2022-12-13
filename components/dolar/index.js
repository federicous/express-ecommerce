const express = require("express");
const dolarController = require("./controllers/dolarController");
const Autenticacion = require("../../middleware/autenticacion");

module.exports = app => {
    const dolarRouter = express.Router();
    app.use("/api/dolar/", dolarRouter);
    dolarRouter.get("/",Autenticacion.usuario, dolarController.getDolar);
    dolarRouter.post("/", dolarController.postDolar);
}

