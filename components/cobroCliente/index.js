const express = require("express");
const cobroClienteController = require("./controllers/cobroClienteController");
const Autenticacion = require("../../middleware/autenticacion");
const upload = require("../../utils/multer");

module.exports = app => {
    const cobroClienteRouter = express.Router();
    app.use("/api/cobroCliente", cobroClienteRouter);
    cobroClienteRouter.get("/", Autenticacion.usuario ,cobroClienteController.getAllElement);
    // cobroClienteRouter.get("/category/:category", Autenticacion.usuario ,cobroClienteController.getAllElementCategory);
    // cobroClienteRouter.get("/brand/:lista", Autenticacion.usuario ,cobroClienteController.getAllElementLista);
    // cobroClienteRouter.get("/:lista/category/:category", Autenticacion.usuario ,cobroClienteController.getAllElementCategoryLista);
    // cobroClienteRouter.get("/:id", Autenticacion.usuario, cobroClienteController.getElement);
    cobroClienteRouter.post("/", Autenticacion.administrador, upload.single('image'), cobroClienteController.createElement);
    // cobroClienteRouter.post("/code", Autenticacion.administrador, upload.single('image'), cobroClienteController.updateAllElementCode);
    // // cobroClienteRouter.put("/:id", Autenticacion.administrador, upload.single('myFile'), cobroClienteController.updateElement);
    // // cobroClienteRouter.put("/", Autenticacion.administrador, upload.single('myFile'), cobroClienteController.updateAllElement);
    // cobroClienteRouter.put("/:id", Autenticacion.administrador, upload.single('image'), cobroClienteController.updateElement);
    cobroClienteRouter.put("/", Autenticacion.administrador, upload.single('image'), cobroClienteController.updateAllElement);
    cobroClienteRouter.delete("/:id", Autenticacion.administrador, cobroClienteController.deleteElement);
    // cobroClienteRouter.delete("/delete/all", Autenticacion.administrador, cobroClienteController.deleteAllElement);
}

