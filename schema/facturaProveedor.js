const managementModel = require('./managementModel');

module.exports = managementModel('facturaProveedor', [
  'id', 'code', 'proveedor', 'vendedor', 'monto', 'fecha', 'vencimiento', 'tipo', 'timestamp', 'name', 'ferreteria', 'email',
]);
