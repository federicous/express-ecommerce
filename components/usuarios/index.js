const express = require("express");
const usuarioController = require("./controllers/usuarioController");
module.exports = app => {
    const userRouter = express.Router();
    app.use("/api/users", userRouter);
    userRouter.get("/", usuarioController.getAllElement);
    userRouter.get("/:id", usuarioController.getElement);
    userRouter.post("/", usuarioController.createElement);
    userRouter.put("/:id", usuarioController.updateElement);
    userRouter.delete("/:id", usuarioController.deleteElement);
}

