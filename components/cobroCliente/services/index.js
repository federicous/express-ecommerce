const MongoService = require('./mongo');
const managementMovementCreate = require('../../../utils/managementMovementCreate');
const Movement = require('../../../schema/cobroClientes');
const Invoice = require('../../../schema/facturaClientes');
const Cheque = require('../../../schema/cheques');
const Payment = require('../../../schema/pagos');
const { managementChequeUse } = require('../../../utils/managementChequeUse');

const service = new MongoService('cobroClientes');
service.save = managementMovementCreate(Movement, Invoice, 'cliente',
  managementChequeUse(Cheque, Movement, Payment, 'in'));
module.exports = service;
