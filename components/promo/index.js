const express = require("express");
const promoController = require("./controllers/promoController");
const Autenticacion = require("../../middleware/autenticacion");
const upload = require("../../utils/multer/promo");

module.exports = app => {
    const promoRouter = express.Router();
    app.use("/api/promo", promoRouter);
    promoRouter.get("/", Autenticacion.usuario ,promoController.getElement);
    promoRouter.get("/category/:category", Autenticacion.usuario ,promoController.getAllElementCategory);
    promoRouter.get("/brand/:lista", Autenticacion.usuario ,promoController.getAllElementLista);
    promoRouter.get("/:lista/category/:category", Autenticacion.usuario ,promoController.getAllElementCategoryLista);
    promoRouter.get("/:id", Autenticacion.usuario, promoController.getElement);
    promoRouter.post("/", Autenticacion.administrador, upload.single('image'), promoController.createElement);
    promoRouter.post("/code", Autenticacion.administrador, upload.single('image'), promoController.updateAllElementCode);
    // promoRouter.put("/:id", Autenticacion.administrador, upload.single('myFile'), promoController.updateElement);
    // promoRouter.put("/", Autenticacion.administrador, upload.single('myFile'), promoController.updateAllElement);
    promoRouter.put("/:id", Autenticacion.administrador, upload.single('image'), promoController.updateElement);
    promoRouter.put("/", Autenticacion.administrador, upload.single('image'), promoController.updateAllElement);
    promoRouter.delete("/:id", Autenticacion.administrador, promoController.deleteElement);
    promoRouter.delete("/delete/all", Autenticacion.administrador, promoController.deleteAllElement);
}

