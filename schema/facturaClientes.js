const managementModel = require('./managementModel');

module.exports = managementModel('facturaClientes', [
  'id', 'code', 'cliente', 'vendedor', 'monto', 'fecha', 'vencimiento', 'tipo', 'timestamp', 'name', 'ferreteria', 'email',
]);
