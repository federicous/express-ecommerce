const express = require("express");
const productController = require("./controllers/productController");
const Autenticacion = require("../../middleware/autenticacion");

module.exports = app => {
    const prodRouter = express.Router();
    app.use("/api/products", prodRouter);
    prodRouter.get("/", Autenticacion.usuario ,productController.getAllElement);
    prodRouter.get("/category/:category", Autenticacion.usuario ,productController.getAllElementCategory);
    prodRouter.get("/brand/:lista", Autenticacion.usuario ,productController.getAllElementLista);
    prodRouter.get("/:lista/category/:category", Autenticacion.usuario ,productController.getAllElementCategoryLista);
    prodRouter.get("/:id", Autenticacion.usuario, productController.getElement);
    prodRouter.post("/", Autenticacion.administrador, productController.createElement);
    prodRouter.put("/:id", Autenticacion.administrador, productController.updateElement);
    prodRouter.put("/", Autenticacion.administrador, productController.updateAllElement);
    prodRouter.delete("/:id", Autenticacion.administrador, productController.deleteElement);
    prodRouter.delete("/", Autenticacion.administrador, productController.deleteAllElement);
}

