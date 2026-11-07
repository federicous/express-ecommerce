const express = require("express");
const pagosController = require("./controllers/pagosController");
const Autenticacion = require("../../middleware/autenticacion");
const upload = require("../../utils/multer");
const requireManagementCode = require("../../middleware/requireManagementCode");
const requireManagementIdempotencyKey = require("../../middleware/requireManagementIdempotencyKey");

module.exports = app => {
    const pagosRouter = express.Router();
    app.use("/api/pagos", pagosRouter);
    pagosRouter.get("/", Autenticacion.gestion ,pagosController.getAllElement);
    // pagosRouter.get("/category/:category", Autenticacion.usuario ,pagosController.getAllElementCategory);
    // pagosRouter.get("/brand/:lista", Autenticacion.usuario ,pagosController.getAllElementLista);
    // pagosRouter.get("/:lista/category/:category", Autenticacion.usuario ,pagosController.getAllElementCategoryLista);
    // pagosRouter.get("/:id", Autenticacion.usuario, pagosController.getElement);
    pagosRouter.post("/", Autenticacion.gestion, requireManagementIdempotencyKey, upload.single('image'), requireManagementCode, pagosController.createElement);
    // pagosRouter.post("/code", Autenticacion.gestion, upload.single('image'), pagosController.updateAllElementCode);
    // // pagosRouter.put("/:id", Autenticacion.gestion, upload.single('myFile'), pagosController.updateElement);
    // // pagosRouter.put("/", Autenticacion.gestion, upload.single('myFile'), pagosController.updateAllElement);
    // pagosRouter.put("/:id", Autenticacion.gestion, upload.single('image'), pagosController.updateElement);
    pagosRouter.put("/", Autenticacion.gestion, (_req, res) => res.status(405).json({
      error: 'mutation_not_supported', message: 'La edición de pagos requiere una regla de corrección aprobada',
    }));
    pagosRouter.delete("/:id", Autenticacion.gestion, pagosController.deleteElement);
    // pagosRouter.delete("/delete/all", Autenticacion.gestion, pagosController.deleteAllElement);
}
