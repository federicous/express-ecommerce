const express = require("express");
const productController = require("./controllers/productController");
const Autenticacion = require("../../middleware/autenticacion");
const upload = require("../../utils/multer");

module.exports = app => {
    const prodRouter = express.Router();
    app.use("/api/products", prodRouter);
    prodRouter.get("/", productController.getAllElement);
    prodRouter.get("/category/:category", productController.getAllElementCategory);
    prodRouter.get("/brand/:lista", productController.getAllElementLista);
    prodRouter.get("/:lista/category/:category", productController.getAllElementCategoryLista);
    prodRouter.get("/:id", productController.getElement);
    prodRouter.post("/", Autenticacion.administrador, upload.single('image'), productController.createElement);
    prodRouter.post("/code", Autenticacion.administrador, upload.single('image'), productController.updateAllElementCode);
    // prodRouter.put("/:id", Autenticacion.administrador, upload.single('myFile'), productController.updateElement);
    // prodRouter.put("/", Autenticacion.administrador, upload.single('myFile'), productController.updateAllElement);
    prodRouter.put("/:id", Autenticacion.administrador, upload.single('image'), productController.updateElement);
    prodRouter.put("/", Autenticacion.administrador, upload.single('image'), productController.updateAllElement);
    prodRouter.delete("/:id", Autenticacion.administrador, productController.deleteElement);
    prodRouter.delete("/delete/all", Autenticacion.administrador, productController.deleteAllElement);
}

