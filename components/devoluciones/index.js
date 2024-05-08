const express = require("express");
const devolucionesController = require("./controllers/devolucionesController");
const Autenticacion = require("../../middleware/autenticacion");
const upload = require("../../utils/multer");

module.exports = app => {
    const devolucionesRouter = express.Router();
    app.use("/api/devoluciones", devolucionesRouter);
    devolucionesRouter.get("/", Autenticacion.usuario ,devolucionesController.getAllElement);
    // devolucionesRouter.get("/category/:category", Autenticacion.usuario ,devolucionesController.getAllElementCategory);
    // devolucionesRouter.get("/brand/:lista", Autenticacion.usuario ,devolucionesController.getAllElementLista);
    // devolucionesRouter.get("/:lista/category/:category", Autenticacion.usuario ,devolucionesController.getAllElementCategoryLista);
    // devolucionesRouter.get("/:id", Autenticacion.usuario, devolucionesController.getElement);
    devolucionesRouter.post("/", Autenticacion.administrador, upload.single('image'), devolucionesController.createElement);
    // devolucionesRouter.post("/code", Autenticacion.administrador, upload.single('image'), devolucionesController.updateAllElementCode);
    // // devolucionesRouter.put("/:id", Autenticacion.administrador, upload.single('myFile'), devolucionesController.updateElement);
    // // devolucionesRouter.put("/", Autenticacion.administrador, upload.single('myFile'), devolucionesController.updateAllElement);
    // devolucionesRouter.put("/:id", Autenticacion.administrador, upload.single('image'), devolucionesController.updateElement);
    devolucionesRouter.put("/", Autenticacion.administrador, upload.single('image'), devolucionesController.updateAllElement);
    devolucionesRouter.delete("/:id", Autenticacion.administrador, devolucionesController.deleteElement);
    // devolucionesRouter.delete("/delete/all", Autenticacion.administrador, devolucionesController.deleteAllElement);
}

