const express = require("express");
const pendientesController = require("./controllers/pendientesController");
const Autenticacion = require("../../middleware/autenticacion");
const upload = require("../../utils/multer");

module.exports = app => {
    const pendientesRouter = express.Router();
    app.use("/api/pendientes", pendientesRouter);
    pendientesRouter.get("/", Autenticacion.usuario ,pendientesController.getAllElement);
    // pendientesRouter.get("/category/:category", Autenticacion.usuario ,pendientesController.getAllElementCategory);
    // pendientesRouter.get("/brand/:lista", Autenticacion.usuario ,pendientesController.getAllElementLista);
    // pendientesRouter.get("/:lista/category/:category", Autenticacion.usuario ,pendientesController.getAllElementCategoryLista);
    // pendientesRouter.get("/:id", Autenticacion.usuario, pendientesController.getElement);
    pendientesRouter.post("/", Autenticacion.administrador, upload.single('image'), pendientesController.createElement);
    // pendientesRouter.post("/code", Autenticacion.administrador, upload.single('image'), pendientesController.updateAllElementCode);
    // // pendientesRouter.put("/:id", Autenticacion.administrador, upload.single('myFile'), pendientesController.updateElement);
    // // pendientesRouter.put("/", Autenticacion.administrador, upload.single('myFile'), pendientesController.updateAllElement);
    // pendientesRouter.put("/:id", Autenticacion.administrador, upload.single('image'), pendientesController.updateElement);
    pendientesRouter.put("/", Autenticacion.administrador, upload.single('image'), pendientesController.updateAllElement);
    // pendientesRouter.delete("/:id", Autenticacion.administrador, pendientesController.deleteElement);
    // pendientesRouter.delete("/delete/all", Autenticacion.administrador, pendientesController.deleteAllElement);
}

