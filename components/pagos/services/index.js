const MongoService = require('./mongo');
const managementMovementCreate = require('../../../utils/managementMovementCreate');
const Movement = require('../../../schema/pagos');
const Invoice = require('../../../schema/facturaProveedor');
const Cheque = require('../../../schema/cheques');
const Collection = require('../../../schema/cobroClientes');
const { managementChequeUse } = require('../../../utils/managementChequeUse');

const service = new MongoService('pagos');
service.save = managementMovementCreate(Movement, Invoice, 'proveedor',
  managementChequeUse(Cheque, Collection, Movement, 'out'));
module.exports = service;
