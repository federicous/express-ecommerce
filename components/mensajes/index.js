const express = require("express");
const productoController = require("./controllers/productoController");
module.exports = app => {
    const prodRouter = express.Router();
    app.use("/api/product", prodRouter);
    prodRouter.get("/", productoController.getAllElement);
    prodRouter.get("/:id", productoController.getElement);
    prodRouter.post("/", productoController.createElement);
    prodRouter.put("/:id", productoController.updateElement);
    prodRouter.delete("/:id", productoController.deleteElement);
}

