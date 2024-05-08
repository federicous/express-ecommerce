const express = require("express");
const pagosController = require("./controllers/pagosController");
const Autenticacion = require("../../middleware/autenticacion");
const upload = require("../../utils/multer");

module.exports = app => {
    const pagosRouter = express.Router();
    app.use("/api/pagos", pagosRouter);
    pagosRouter.get("/", Autenticacion.usuario ,pagosController.getAllElement);
    // pagosRouter.get("/category/:category", Autenticacion.usuario ,pagosController.getAllElementCategory);
    // pagosRouter.get("/brand/:lista", Autenticacion.usuario ,pagosController.getAllElementLista);
    // pagosRouter.get("/:lista/category/:category", Autenticacion.usuario ,pagosController.getAllElementCategoryLista);
    // pagosRouter.get("/:id", Autenticacion.usuario, pagosController.getElement);
    pagosRouter.post("/", Autenticacion.administrador, upload.single('image'), pagosController.createElement);
    // pagosRouter.post("/code", Autenticacion.administrador, upload.single('image'), pagosController.updateAllElementCode);
    // // pagosRouter.put("/:id", Autenticacion.administrador, upload.single('myFile'), pagosController.updateElement);
    // // pagosRouter.put("/", Autenticacion.administrador, upload.single('myFile'), pagosController.updateAllElement);
    // pagosRouter.put("/:id", Autenticacion.administrador, upload.single('image'), pagosController.updateElement);
    pagosRouter.put("/", Autenticacion.administrador, upload.single('image'), pagosController.updateAllElement);
    pagosRouter.delete("/:id", Autenticacion.administrador, pagosController.deleteElement);
    // pagosRouter.delete("/delete/all", Autenticacion.administrador, pagosController.deleteAllElement);
}

