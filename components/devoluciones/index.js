const express = require("express");
const devolucionesController = require("./controllers/devolucionesController");
const Autenticacion = require("../../middleware/autenticacion");
const upload = require("../../utils/multer");
const requireManagementCode = require("../../middleware/requireManagementCode");

module.exports = app => {
    const devolucionesRouter = express.Router();
    app.use("/api/devoluciones", devolucionesRouter);
    devolucionesRouter.get("/", Autenticacion.gestion ,devolucionesController.getAllElement);
    // devolucionesRouter.get("/category/:category", Autenticacion.usuario ,devolucionesController.getAllElementCategory);
    // devolucionesRouter.get("/brand/:lista", Autenticacion.usuario ,devolucionesController.getAllElementLista);
    // devolucionesRouter.get("/:lista/category/:category", Autenticacion.usuario ,devolucionesController.getAllElementCategoryLista);
    // devolucionesRouter.get("/:id", Autenticacion.usuario, devolucionesController.getElement);
    devolucionesRouter.post("/", Autenticacion.gestion, upload.single('image'), requireManagementCode, devolucionesController.createElement);
    // devolucionesRouter.post("/code", Autenticacion.gestion, upload.single('image'), devolucionesController.updateAllElementCode);
    // // devolucionesRouter.put("/:id", Autenticacion.gestion, upload.single('myFile'), devolucionesController.updateElement);
    // // devolucionesRouter.put("/", Autenticacion.gestion, upload.single('myFile'), devolucionesController.updateAllElement);
    // devolucionesRouter.put("/:id", Autenticacion.gestion, upload.single('image'), devolucionesController.updateElement);
    const correctionPending = (_req, res) => res.status(405).json({ error: 'mutation_not_supported',
        message: 'La corrección o anulación de una devolución requiere un procedimiento de conciliación' });
    devolucionesRouter.put("/", Autenticacion.gestion, correctionPending);
    devolucionesRouter.put("/:id", Autenticacion.gestion, correctionPending);
    devolucionesRouter.delete("/:id", Autenticacion.gestion, correctionPending);
    // devolucionesRouter.delete("/delete/all", Autenticacion.gestion, devolucionesController.deleteAllElement);
}
