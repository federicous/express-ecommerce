const managementModel = require('./managementModel');

module.exports = managementModel('gastos', [
  'id', 'code', 'gasto', 'detalle', 'monto', 'fecha', 'vencimiento', 'tipo', 'timestamp', 'medioDePago',
]);
