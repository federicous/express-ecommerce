const express = require("express");
const devolucionesController = require("./controllers/devolucionesController");
const Autenticacion = require("../../middleware/autenticacion");
const upload = require("../../utils/multer");
const requireManagementCode = require("../../middleware/requireManagementCode");

module.exports = app => {
    const devolucionesRouter = express.Router();
    app.use("/api/devoluciones", devolucionesRouter);
    devolucionesRouter.get("/", Autenticacion.administrador ,devolucionesController.getAllElement);
    // devolucionesRouter.get("/category/:category", Autenticacion.usuario ,devolucionesController.getAllElementCategory);
    // devolucionesRouter.get("/brand/:lista", Autenticacion.usuario ,devolucionesController.getAllElementLista);
    // devolucionesRouter.get("/:lista/category/:category", Autenticacion.usuario ,devolucionesController.getAllElementCategoryLista);
    // devolucionesRouter.get("/:id", Autenticacion.usuario, devolucionesController.getElement);
    devolucionesRouter.post("/", Autenticacion.administrador, upload.single('image'), requireManagementCode, devolucionesController.createElement);
    // devolucionesRouter.post("/code", Autenticacion.administrador, upload.single('image'), devolucionesController.updateAllElementCode);
    // // devolucionesRouter.put("/:id", Autenticacion.administrador, upload.single('myFile'), devolucionesController.updateElement);
    // // devolucionesRouter.put("/", Autenticacion.administrador, upload.single('myFile'), devolucionesController.updateAllElement);
    // devolucionesRouter.put("/:id", Autenticacion.administrador, upload.single('image'), devolucionesController.updateElement);
    const correctionPending = (_req, res) => res.status(405).json({ error: 'mutation_not_supported',
        message: 'La corrección o anulación de una devolución requiere un procedimiento de conciliación' });
    devolucionesRouter.put("/", Autenticacion.administrador, correctionPending);
    devolucionesRouter.put("/:id", Autenticacion.administrador, correctionPending);
    devolucionesRouter.delete("/:id", Autenticacion.administrador, correctionPending);
    // devolucionesRouter.delete("/delete/all", Autenticacion.administrador, devolucionesController.deleteAllElement);
}
