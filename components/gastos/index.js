const express = require("express");
const gastosController = require("./controllers/gastosController");
const Autenticacion = require("../../middleware/autenticacion");
const upload = require("../../utils/multer");
const requireManagementCode = require("../../middleware/requireManagementCode");

module.exports = app => {
    const gastosRouter = express.Router();
    app.use("/api/gastos", gastosRouter);
    gastosRouter.get("/", Autenticacion.gestion ,gastosController.getAllElement);
    // gastosRouter.get("/category/:category", Autenticacion.usuario ,gastosController.getAllElementCategory);
    // gastosRouter.get("/brand/:lista", Autenticacion.usuario ,gastosController.getAllElementLista);
    // gastosRouter.get("/:lista/category/:category", Autenticacion.usuario ,gastosController.getAllElementCategoryLista);
    // gastosRouter.get("/:id", Autenticacion.usuario, gastosController.getElement);
    gastosRouter.post("/", Autenticacion.gestion, upload.single('image'), requireManagementCode, gastosController.createElement);
    // gastosRouter.post("/code", Autenticacion.gestion, upload.single('image'), gastosController.updateAllElementCode);
    // // gastosRouter.put("/:id", Autenticacion.gestion, upload.single('myFile'), gastosController.updateElement);
    // // gastosRouter.put("/", Autenticacion.gestion, upload.single('myFile'), gastosController.updateAllElement);
    // gastosRouter.put("/:id", Autenticacion.gestion, upload.single('image'), gastosController.updateElement);
    gastosRouter.put("/:id", Autenticacion.gestion, upload.single('image'), gastosController.updateElement);
    gastosRouter.put("/", Autenticacion.gestion, upload.single('image'), gastosController.updateAllElement);
    gastosRouter.delete("/:id", Autenticacion.gestion, gastosController.deleteElement);
    // gastosRouter.delete("/delete/all", Autenticacion.gestion, gastosController.deleteAllElement);
}
