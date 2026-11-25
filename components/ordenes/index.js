const express = require("express");
const ordenController = require("./controllers/ordenController");
const Autenticacion = require("../../middleware/autenticacion");
const mongoose = require('mongoose');
const Order = require('../../schema/ordenes');
const { createOwnStatusHandler } = require('../../utils/order-notifications/own-status');
const { createAdminOrderListHandler } = require('../../utils/order-notifications/admin-order-list');

module.exports = app => {
    const ordenRouter = express.Router();
    app.use("/api/order", ordenRouter);
    ordenRouter.get("/", Autenticacion.administrador, ordenController.getAllElement);
    ordenRouter.get("/notifications/pending", Autenticacion.administrador, ordenController.pendingNotifications);
    ordenRouter.get('/admin/list', Autenticacion.administrador, createAdminOrderListHandler(Order, mongoose.Types.ObjectId));
    ordenRouter.get('/:id/my-notification', Autenticacion.usuario, createOwnStatusHandler(Order, id => /^[0-9a-fA-F]{24}$/.test(id) && mongoose.isValidObjectId(id)));
    ordenRouter.get("/:id/notification", Autenticacion.administrador, ordenController.notificationStatus);
    ordenRouter.post("/:id/notification/retry", Autenticacion.administrador, ordenController.retryNotification);
    ordenRouter.get("/id/:id", Autenticacion.administrador, ordenController.getElement);
    ordenRouter.get("/user", Autenticacion.usuario, ordenController.getAllElementUser);
    ordenRouter.post("/", Autenticacion.usuario, ordenController.createElement);
    ordenRouter.post("/user", Autenticacion.administrador, ordenController.createElementUser);
    ordenRouter.delete("/:id", Autenticacion.administrador, ordenController.deleteElement);
}

