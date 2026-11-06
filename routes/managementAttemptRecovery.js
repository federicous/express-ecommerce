const Attempt = require('../schema/managementMovementAttempt');
const Collections = require('../schema/cobroClientes');
const Payments = require('../schema/pagos');
const Sales = require('../schema/facturaClientes');
const Purchases = require('../schema/facturaProveedor');
const { cents } = require('../utils/managementMovementCreate');
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const resources = {
  cobroClientes: { Movement: Collections, Invoice: Sales, party: 'cliente' },
  pagos: { Movement: Payments, Invoice: Purchases, party: 'proveedor' },
};

// Snapshot reads only: absence is NOT proof that an earlier POST cannot commit.
async function readAttempt({ key, actor, resource }, dependencies = {}) {
  const AttemptModel = dependencies.Attempt || Attempt;
  const mapping = dependencies.resources || resources;
  const { Movement, Invoice } = mapping[resource];
  const session = await AttemptModel.db.startSession();
  let result;
  try {
    await session.withTransaction(async () => {
      const attempt = await AttemptModel.findOne({ _id: key, actor, resource: Movement.collection.collectionName }).session(session).lean();
      if (!attempt) { result = { status: 'not_confirmed' }; return; }
      const movement = await Movement.findById(attempt.movementId).session(session).lean();
      const invoice = movement?.invoiceId
        ? await Invoice.findById(movement.invoiceId).session(session).lean() : null;
      result = classifyAttempt(attempt, movement, invoice, mapping[resource]);
    }, { readConcern: { level: 'snapshot' }, readPreference: 'primary' });
    return result;
  } finally { await session.endSession(); }
}

function classifyAttempt(attempt, movement, invoice, { party }) {
  if (!movement || !invoice || String(movement._id) !== String(attempt.movementId)
    || !/^[0-9a-f]{64}$/.test(attempt.fingerprint || '')
    || String(invoice._id) !== movement.invoiceId || movement.code !== invoice.code
    || typeof invoice[party] !== 'string' || !invoice[party].trim()
    || movement[party] !== invoice[party] || cents(movement.monto) === null
    || cents(movement.monto) <= 0n) return { status: 'inconsistent' };
  // Explicit allowlist: no fingerprint, actor, JWT, complete document or party data.
  return { status: 'confirmed', movement: {
    id: String(movement._id), code: movement.code, amount: movement.monto,
    date: movement.fecha || null, paymentMethod: movement.medioDePago || null,
  } };
}

function createAttemptRecoveryHandler(reader = readAttempt) {
  return async (req, res) => {
    res.set('Cache-Control', 'no-store');
    const actor = req.user?.id;
    if (typeof actor !== 'string' || !actor.trim()) {
      return res.status(403).json({ error: 'recovery_actor_required' });
    }
    const { resource, key } = req.params;
    if (!Object.hasOwn(resources, resource) || !UUID.test(key || '')) {
      return res.status(400).json({ error: 'invalid_recovery_identity' });
    }
    try {
      const result = await reader({ actor, resource, key });
      return res.status(200).json({ ...result, key, resource });
    } catch (_) {
      // Infrastructure errors must never be translated into absence or success.
      return res.status(503).json({ error: 'recovery_unavailable',
        message: 'No se pudo confirmar el intento. Conservá su identidad y revisalo antes de continuar.' });
    }
  };
}

module.exports = { createAttemptRecoveryHandler, classifyAttempt, readAttempt };
