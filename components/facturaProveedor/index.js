const express = require("express");
const facturaProveedorController = require("./controllers/facturaProveedorController");
const Autenticacion = require("../../middleware/autenticacion");
const upload = require("../../utils/multer");

module.exports = app => {
    const facturaProveedorRouter = express.Router();
    app.use("/api/facturaProveedor", facturaProveedorRouter);
    facturaProveedorRouter.get("/", Autenticacion.usuario ,facturaProveedorController.getAllElement);
    // facturaProveedorRouter.get("/category/:category", Autenticacion.usuario ,facturaProveedorController.getAllElementCategory);
    // facturaProveedorRouter.get("/brand/:lista", Autenticacion.usuario ,facturaProveedorController.getAllElementLista);
    // facturaProveedorRouter.get("/:lista/category/:category", Autenticacion.usuario ,facturaProveedorController.getAllElementCategoryLista);
    // facturaProveedorRouter.get("/:id", Autenticacion.usuario, facturaProveedorController.getElement);
    facturaProveedorRouter.post("/", Autenticacion.administrador, upload.single('image'), facturaProveedorController.createElement);
    // facturaProveedorRouter.post("/code", Autenticacion.administrador, upload.single('image'), facturaProveedorController.updateAllElementCode);
    // // facturaProveedorRouter.put("/:id", Autenticacion.administrador, upload.single('myFile'), facturaProveedorController.updateElement);
    // // facturaProveedorRouter.put("/", Autenticacion.administrador, upload.single('myFile'), facturaProveedorController.updateAllElement);
    // facturaProveedorRouter.put("/:id", Autenticacion.administrador, upload.single('image'), facturaProveedorController.updateElement);
    facturaProveedorRouter.put("/", Autenticacion.administrador, upload.single('image'), facturaProveedorController.updateAllElement);
    // facturaProveedorRouter.delete("/:id", Autenticacion.administrador, facturaProveedorController.deleteElement);
    // facturaProveedorRouter.delete("/delete/all", Autenticacion.administrador, facturaProveedorController.deleteAllElement);
}

