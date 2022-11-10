const express = require("express");
const listaController = require("./controllers/listaController");
const Autenticacion = require("../../middleware/autenticacion");
const upload = require("../../utils/multer/listas")

module.exports = app => {
    const lista = express.Router();
    app.use("/api/listas", lista);
    // lista.get("/:id", Autenticacion.usuario ,listaController.getElement);
    // lista.get("/", Autenticacion.usuario ,listaController.getElement);
    // lista.get("/:lista/:id", Autenticacion.usuario ,listaController.getElementLista);
    // lista.put("/", Autenticacion.usuario ,listaController.modifyList);
    // lista.put("/:lista", Autenticacion.administrador ,listaController.modifyList);
    lista.put("/modificar/:lista", Autenticacion.administrador ,listaController.modifyList);
    lista.post("/subir", Autenticacion.administrador, upload.single('lista'), listaController.uploadList);

}

