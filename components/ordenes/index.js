const express = require("express");
const ordenController = require("./controllers/ordenController");
module.exports = app => {
    const ordenRouter = express.Router();
    app.use("/api/order", ordenRouter);
    ordenRouter.get("/", ordenController.getAllElement);
    ordenRouter.get("/:id", ordenController.getElement);
    // ordenRouter.get("/:id/product", ordenController.getSubElement);
    ordenRouter.post("/", ordenController.createElement);
    // ordenRouter.post("/:id/product", ordenController.createSubElement);
    // ordenRouter.put("/:id", ordenController.updateElement);
    ordenRouter.delete("/:id", ordenController.deleteElement);
    // ordenRouter.delete("/:id/product/:id_prod", ordenController.deleteSubElement);
}

