const managementModel = require('./managementModel');

module.exports = managementModel('cobroClientes', [
  'id', 'code', 'invoiceId', 'chequeId', 'cliente', 'vendedor', 'monto', 'fecha', 'vencimiento', 'tipo', 'timestamp', 'medioDePago', 'cheque', 'name', 'ferreteria',
]);
