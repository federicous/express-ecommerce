const express = require("express");
const ordenController = require("./controllers/ordenController");
module.exports = app => {
    const ordenRouter = express.Router();
    app.use("/api/order", ordenRouter);
    ordenRouter.get("/", ordenController.getAllElement);
    ordenRouter.get("/:id", ordenController.getElement);
    ordenRouter.post("/", ordenController.createElement);
    ordenRouter.delete("/:id", ordenController.deleteElement);
}

