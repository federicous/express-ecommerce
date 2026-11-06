const managementModel = require('./managementModel');

module.exports = managementModel('cheques', [
  'id', 'code', 'linkVersion', 'cliente', 'vendedor', 'monto', 'fecha', 'banco', 'bancoOtro', 'emisor', 'timestamp', 'estado', 'tipo', 'name', 'ferreteria',
]);
