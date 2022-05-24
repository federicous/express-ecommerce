const express = require("express");
const mensajeController = require("./controllers/mensajeController");
module.exports = app => {
    const mensajeRouter = express.Router();
    app.use("/api/message", mensajeRouter);
    mensajeRouter.get("/", mensajeController.getAllElement);
    mensajeRouter.get("/:id", mensajeController.getElement);
    mensajeRouter.post("/", mensajeController.createElement);
    mensajeRouter.put("/:id", mensajeController.updateElement);
    mensajeRouter.delete("/:id", mensajeController.deleteElement);
}

