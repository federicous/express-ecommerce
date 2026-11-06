const managementModel = require('./managementModel');

module.exports = managementModel('devoluciones', [
  'id', 'code', 'cliente', 'vendedor', 'codigoProducto', 'fecha', 'detalle', 'tipo', 'timestamp', 'medioDePago', 'name', 'ferreteria',
  'invoiceId', 'reconciliationStatus',
]);
