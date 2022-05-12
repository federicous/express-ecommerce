const express = require("express");
const carritoController = require("./controllers/carritoController");
module.exports = app => {
    const carritoRouter = express.Router();
    app.use("/api/cart", carritoRouter);
    carritoRouter.get("/", carritoController.getAllElement);
    carritoRouter.get("/:id", carritoController.getElement);
    carritoRouter.get("/:id/product", carritoController.getSubElement);
    carritoRouter.post("/", carritoController.createElement);
    carritoRouter.post("/:id/product", carritoController.createSubElement);
    carritoRouter.put("/:id", carritoController.updateElement);
    carritoRouter.delete("/:id", carritoController.deleteElement);
    carritoRouter.delete("/:id/product/:id_prod", carritoController.deleteSubElement);
}

