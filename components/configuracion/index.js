const express = require("express");
const configuracionController = require("./controllers/configuracionController");
const Autenticacion = require("../../middleware/autenticacion");

module.exports = app => {
    const configRouter = express.Router();
    app.use("/api/config", configRouter);

    // GET /api/config/public-prices (acceso público)
    configRouter.get("/public-prices", (req, res) => configuracionController.getPublicPrices(req, res));

    // POST/PUT /api/config/public-prices (protegido por middleware de administrador)
    configRouter.post("/public-prices", Autenticacion.administrador, (req, res) => configuracionController.setPublicPrices(req, res));
    configRouter.put("/public-prices", Autenticacion.administrador, (req, res) => configuracionController.setPublicPrices(req, res));
};
