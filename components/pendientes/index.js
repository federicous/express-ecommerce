const express = require("express");
const pendientesController = require("./controllers/pendientesController");
const Autenticacion = require("../../middleware/autenticacion");
const upload = require("../../utils/multer");
const requireManagementCode = require("../../middleware/requireManagementCode");
const status = require("./status");

module.exports = app => {
    const pendientesRouter = express.Router();
    app.use("/api/pendientes", pendientesRouter);
    pendientesRouter.get("/", Autenticacion.gestion ,pendientesController.getAllElement);
    // pendientesRouter.get("/category/:category", Autenticacion.usuario ,pendientesController.getAllElementCategory);
    // pendientesRouter.get("/brand/:lista", Autenticacion.usuario ,pendientesController.getAllElementLista);
    // pendientesRouter.get("/:lista/category/:category", Autenticacion.usuario ,pendientesController.getAllElementCategoryLista);
    // pendientesRouter.get("/:id", Autenticacion.usuario, pendientesController.getElement);
    pendientesRouter.post("/", Autenticacion.gestion, upload.single('image'), requireManagementCode, pendientesController.createElement);
    // pendientesRouter.post("/code", Autenticacion.gestion, upload.single('image'), pendientesController.updateAllElementCode);
    // // pendientesRouter.put("/:id", Autenticacion.gestion, upload.single('myFile'), pendientesController.updateElement);
    // // pendientesRouter.put("/", Autenticacion.gestion, upload.single('myFile'), pendientesController.updateAllElement);
    // pendientesRouter.put("/:id", Autenticacion.gestion, upload.single('image'), pendientesController.updateElement);
    pendientesRouter.put("/:id/status", Autenticacion.gestion, status.finish);
    const correctionPending = (_req, res) => res.status(405).json({ error: 'mutation_not_supported',
        message: 'La corrección o eliminación de un pendiente requiere revisión operativa' });
    pendientesRouter.put("/", Autenticacion.gestion, correctionPending);
    pendientesRouter.delete("/:id", Autenticacion.gestion, correctionPending);
    // pendientesRouter.delete("/delete/all", Autenticacion.gestion, pendientesController.deleteAllElement);
}
