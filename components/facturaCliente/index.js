const express = require("express");
const facturaClienteController = require("./controllers/facturaClienteController");
const Autenticacion = require("../../middleware/autenticacion");
const upload = require("../../utils/multer");
const requireManagementCode = require("../../middleware/requireManagementCode");
const managementLinkedInvoice = require('../../utils/managementLinkedInvoice');
const linked = managementLinkedInvoice(require('../../schema/facturaClientes'), require('../../schema/cobroClientes'), 'cliente',
    [require('../../schema/devoluciones'), require('../../schema/pendientes')]);

module.exports = app => {
    const facturaClienteRouter = express.Router();
    app.use("/api/facturaCliente", facturaClienteRouter);
    facturaClienteRouter.get("/", Autenticacion.administrador ,facturaClienteController.getAllElement);
    // facturaClienteRouter.get("/category/:category", Autenticacion.usuario ,facturaClienteController.getAllElementCategory);
    // facturaClienteRouter.get("/brand/:lista", Autenticacion.usuario ,facturaClienteController.getAllElementLista);
    // facturaClienteRouter.get("/:lista/category/:category", Autenticacion.usuario ,facturaClienteController.getAllElementCategoryLista);
    // facturaClienteRouter.get("/:id", Autenticacion.usuario, facturaClienteController.getElement);
    facturaClienteRouter.post("/", Autenticacion.administrador, upload.single('image'), requireManagementCode, facturaClienteController.createElement);
    // facturaClienteRouter.post("/code", Autenticacion.administrador, upload.single('image'), facturaClienteController.updateAllElementCode);
    // // facturaClienteRouter.put("/:id", Autenticacion.administrador, upload.single('myFile'), facturaClienteController.updateElement);
    // // facturaClienteRouter.put("/", Autenticacion.administrador, upload.single('myFile'), facturaClienteController.updateAllElement);
    facturaClienteRouter.put("/:id", Autenticacion.administrador, linked.updateById);
    facturaClienteRouter.put("/", Autenticacion.administrador, linked.updateRoot);
    facturaClienteRouter.delete("/:id", Autenticacion.administrador, linked.deleteById);
    // facturaClienteRouter.delete("/delete/all", Autenticacion.administrador, facturaClienteController.deleteAllElement);
}
