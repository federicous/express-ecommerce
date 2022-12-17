const express = require("express");
const dolarAutomaticoController = require("./controllers/dolarAutomaticoController");
const Autenticacion = require("../../middleware/autenticacion");

module.exports = app => {
    const dolarRouter = express.Router();
    app.use("/api/dolar/", dolarRouter);
    dolarRouter.get("/", dolarAutomaticoController.getDolar);
    dolarRouter.post("/", dolarAutomaticoController.postDolar);
}

