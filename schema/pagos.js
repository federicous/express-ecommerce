const managementModel = require('./managementModel');

module.exports = managementModel('pagos', [
  'id', 'code', 'invoiceId', 'chequeId', 'cliente', 'proveedor', 'monto', 'fecha', 'vencimiento', 'tipo', 'timestamp', 'medioDePago', 'cheque',
]);
