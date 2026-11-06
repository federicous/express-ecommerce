const MongoService = require('./mongo');
const { cents } = require('../../../utils/managementMovementCreate');

const service = new MongoService('cheques');
const legacySave = service.save.bind(service);
service.save = async (payload) => {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)
    || Object.hasOwn(payload, 'linkVersion')) return { error: 'invalid_cheque_reference' };
  if (typeof payload.cliente !== 'string' || !payload.cliente.trim()
    || !['cheque', 'e-cheq'].includes(payload.tipo)) return { error: 'invalid_cheque_record' };
  const amount = cents(payload.monto);
  if (amount === null || amount <= 0n) return { error: 'invalid_amount' };
  return legacySave({ ...payload, linkVersion: 'd04' });
};

module.exports = service;
