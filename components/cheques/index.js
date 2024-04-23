const express = require("express");
const chequeController = require("./controllers/chequeController");
const Autenticacion = require("../../middleware/autenticacion");
const upload = require("../../utils/multer");

module.exports = app => {
    const chequeRouter = express.Router();
    app.use("/api/cheque", chequeRouter);
    chequeRouter.get("/", Autenticacion.usuario ,chequeController.getAllElement);
    // chequeRouter.get("/category/:category", Autenticacion.usuario ,chequeController.getAllElementCategory);
    // chequeRouter.get("/brand/:lista", Autenticacion.usuario ,chequeController.getAllElementLista);
    // chequeRouter.get("/:lista/category/:category", Autenticacion.usuario ,chequeController.getAllElementCategoryLista);
    // chequeRouter.get("/:id", Autenticacion.usuario, chequeController.getElement);
    chequeRouter.post("/", Autenticacion.administrador, upload.single('image'), chequeController.createElement);
    // chequeRouter.post("/code", Autenticacion.administrador, upload.single('image'), chequeController.updateAllElementCode);
    // // chequeRouter.put("/:id", Autenticacion.administrador, upload.single('myFile'), chequeController.updateElement);
    // // chequeRouter.put("/", Autenticacion.administrador, upload.single('myFile'), chequeController.updateAllElement);
    // chequeRouter.put("/:id", Autenticacion.administrador, upload.single('image'), chequeController.updateElement);
    chequeRouter.put("/", Autenticacion.administrador, upload.single('image'), chequeController.updateAllElement);
    // chequeRouter.delete("/:id", Autenticacion.administrador, chequeController.deleteElement);
    // chequeRouter.delete("/delete/all", Autenticacion.administrador, chequeController.deleteAllElement);
}

