const managementModel = require('./managementModel');

module.exports = managementModel('pendientes', [
  'id', 'code', 'cliente', 'vendedor', 'listaProductos', 'fecha', 'detalle', 'estado', 'timestamp', 'name', 'ferreteria',
  'invoiceId', 'trackingVersion', 'statusChangedAt', 'statusChangedBy',
]);
