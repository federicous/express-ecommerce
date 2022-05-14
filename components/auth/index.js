const express = require("express");
const authController = require("./controllers/authController");
module.exports = app => {
    const authRouter = express.Router();
    app.use("/", authRouter);
    authRouter.get("/login", authController.getLogin);
    authRouter.post("/login", authController.postLogin);
    authRouter.get("/home", authController.getHome);

    // authRouter.get("/", authController.getAllElement);
    // authRouter.get("/:id", authController.getElement);
    // authRouter.post("/", authController.createElement);
    // authRouter.put("/:id", authController.updateElement);
    // authRouter.delete("/:id", authController.deleteElement);
}

