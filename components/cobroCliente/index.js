const express = require("express");
const cobroClienteController = require("./controllers/cobroClienteController");
const Autenticacion = require("../../middleware/autenticacion");
const upload = require("../../utils/multer");
const requireManagementCode = require("../../middleware/requireManagementCode");
const requireManagementIdempotencyKey = require("../../middleware/requireManagementIdempotencyKey");

module.exports = app => {
    const cobroClienteRouter = express.Router();
    app.use("/api/cobroCliente", cobroClienteRouter);
    cobroClienteRouter.get("/", Autenticacion.gestion ,cobroClienteController.getAllElement);
    // cobroClienteRouter.get("/category/:category", Autenticacion.usuario ,cobroClienteController.getAllElementCategory);
    // cobroClienteRouter.get("/brand/:lista", Autenticacion.usuario ,cobroClienteController.getAllElementLista);
    // cobroClienteRouter.get("/:lista/category/:category", Autenticacion.usuario ,cobroClienteController.getAllElementCategoryLista);
    // cobroClienteRouter.get("/:id", Autenticacion.usuario, cobroClienteController.getElement);
    cobroClienteRouter.post("/", Autenticacion.gestion, requireManagementIdempotencyKey, upload.single('image'), requireManagementCode, cobroClienteController.createElement);
    // cobroClienteRouter.post("/code", Autenticacion.gestion, upload.single('image'), cobroClienteController.updateAllElementCode);
    // // cobroClienteRouter.put("/:id", Autenticacion.gestion, upload.single('myFile'), cobroClienteController.updateElement);
    // // cobroClienteRouter.put("/", Autenticacion.gestion, upload.single('myFile'), cobroClienteController.updateAllElement);
    // cobroClienteRouter.put("/:id", Autenticacion.gestion, upload.single('image'), cobroClienteController.updateElement);
    // No confirmed correction policy for financial movements. The legacy PUT
    // could rewrite invoiceId/code without checking references, so fail closed.
    cobroClienteRouter.put("/", Autenticacion.gestion, (_req, res) => res.status(405).json({
      error: 'mutation_not_supported', message: 'La edición de cobros requiere una regla de corrección aprobada',
    }));
    cobroClienteRouter.delete("/:id", Autenticacion.gestion, cobroClienteController.deleteElement);
    // cobroClienteRouter.delete("/delete/all", Autenticacion.gestion, cobroClienteController.deleteAllElement);
}
