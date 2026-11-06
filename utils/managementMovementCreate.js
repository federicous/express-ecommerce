const crypto = require('node:crypto');
const Attempt = require('../schema/managementMovementAttempt');
const attemptResources = new WeakMap();

function validAttemptKey(value) {
  return typeof value === 'string'
    && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function movementFingerprint(Movement, payload, partyField, actor) {
  const serverDerived = new Set(['_id', '__v', 'timestamp', 'invoiceId', 'chequeId', 'chequeIdempotencyKey']);
  const businessFields = Object.keys(Movement.schema?.paths || {}).filter((field) => !serverDerived.has(field));
  const input = {};
  for (const field of businessFields) {
    if (Object.hasOwn(payload, field)) input[field] = payload[field];
  }
  if (typeof input.code === 'string') input.code = input.code.trim();
  const amount = cents(input.monto);
  if (amount !== null) input.monto = `${amount / 100n}.${String(amount % 100n).padStart(2, '0')}`;
  // Retain a supplied party in the fingerprint: replacing an attempt with a
  // different client/provider is a conflict, even though the server derives it.
  if (Object.hasOwn(payload, partyField)) input[partyField] = payload[partyField];
  return crypto.createHash('sha256').update(JSON.stringify({ actor, input })).digest('hex');
}

async function ensureAttemptCollection(AttemptModel) {
  let ready = attemptResources.get(AttemptModel);
  if (!ready) {
    ready = AttemptModel.createCollection().catch((error) => {
      if (error.code === 48 || error.codeName === 'NamespaceExists') return AttemptModel.collection;
      throw error;
    });
    attemptResources.set(AttemptModel, ready);
  }
  try { return await ready; } catch (error) { attemptResources.delete(AttemptModel); throw error; }
}

// Never fall back to an unsafe read/insert when transactions are unavailable.
async function runTransaction(Invoice, work) {
  const session = await Invoice.db.startSession();
  let result;
  try {
    await session.withTransaction(async () => {
      result = await work(session);
      if (result.error) throw Object.assign(new Error(result.error), { movementRejection: result });
    }, { readConcern: { level: 'snapshot' }, writeConcern: { w: 'majority' }, readPreference: 'primary' });
    return result; // Only return success after the commit was acknowledged.
  } catch (error) {
    if (error.movementRejection) return error.movementRejection;
    if (error.code === 20 || error.codeName === 'IllegalOperation') return { error: 'atomicity_unavailable' };
    throw error;
  } finally { await session.endSession(); }
}

// Parse decimal money exactly; never round a floating-point calculation into a balance.
function cents(value) {
  if (typeof value !== 'string' && (typeof value !== 'number' || !Number.isFinite(value))) return null;
  const match = String(value).trim().match(/^(\d+)(?:\.(\d{1,2}))?$/);
  if (!match) return null;
  return BigInt(match[1]) * 100n + BigInt((match[2] || '').padEnd(2, '0'));
}

// D02/D03: derive identity on the server; new movements require an invoice and
// may not exceed its remaining balance. Historical rows are never rewritten.
function managementMovementCreate(Movement, Invoice, partyField, chequeUse, AttemptModel = Attempt) {
  return async function saveMovement(payload) {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return { error: 'invalid_reference' };
    if (Object.prototype.hasOwnProperty.call(payload, 'chequeId')) return { error: 'invalid_cheque_reference' };
    if (['_id', 'id', 'timestamp', 'invoiceId', 'chequeIdempotencyKey']
      .some((field) => Object.prototype.hasOwnProperty.call(payload, field))) return { error: 'invalid_reference' };
    const attemptKey = payload.idempotencyKey;
    if (!validAttemptKey(attemptKey)) return { error: 'invalid_idempotency_key' };
    const actor = typeof payload.idempotencyActor === 'string' ? payload.idempotencyActor.trim() : '';
    if (!actor) return { error: 'idempotency_actor_required' };
    const code = payload.code;
    if (typeof code !== 'string' || !code.trim()) return { error: 'invalid_reference' };
    const resource = Movement.collection.collectionName;
    const fingerprint = movementFingerprint(Movement, payload, partyField, actor);
    await ensureAttemptCollection(AttemptModel);
    try {
      return await runTransaction(Invoice, async (session) => {
        const prior = await AttemptModel.findById(attemptKey).session(session).lean();
        if (prior) {
          if (prior.resource !== resource || prior.actor !== actor || prior.fingerprint !== fingerprint) return { error: 'idempotency_conflict' };
          const original = await Movement.findById(prior.movementId).session(session).lean();
          return original ? { resultado: original, idempotentReplay: true } : { error: 'idempotency_record_inconsistent' };
        }
        const invoices = await Invoice.find({ code: code.trim() }).session(session).limit(2).lean();
        if (invoices.length > 1) return { error: 'ambiguous_reference' };
        if (!invoices.length) return { error: 'reference_not_found' };

        // A real write serializes transactions on this invoice across backend processes.
        const invoice = await Invoice.findOneAndUpdate({ _id: invoices[0]._id },
          { $inc: { __v: 1 } }, { new: true, session }).lean();
        if (!invoice) return { error: 'reference_not_found' };
        const movement = { ...payload, code: code.trim(), timestamp: Date.now() };
        if (typeof invoice[partyField] !== 'string' || !invoice[partyField].trim()
          || (payload[partyField] && payload[partyField] !== invoice[partyField])) {
          return { error: 'reference_mismatch' };
        }
        const amount = cents(payload.monto);
        if (amount === null || amount <= 0n) return { error: 'invalid_amount' };
        const invoiceAmount = cents(invoice.monto);
        if (invoiceAmount === null || invoiceAmount <= 0n) return { error: 'invalid_existing_balance' };
        const existing = await Movement.find({ $or: [
          { invoiceId: String(invoice._id) }, { code: code.trim() },
        ] }).session(session).lean();
        let paid = 0n;
        for (const row of existing) {
          const previous = cents(row.monto);
          // A legacy row without invoiceId counts by code only when its party is
          // consistent. Contradictory historical data requires manual audit.
          if (previous === null || previous <= 0n || row.code !== code.trim()
            || row[partyField] !== invoice[partyField]
            || (row.invoiceId && row.invoiceId !== String(invoice._id))) {
            return { error: 'invalid_existing_balance' };
          }
          paid += previous;
        }
        if (paid > invoiceAmount) return { error: 'invalid_existing_balance' };
        if (amount > invoiceAmount - paid) return { error: 'amount_exceeds_balance' };
        const cheque = await chequeUse(payload, amount, invoice, session);
        if (cheque.error) return cheque;
        movement[partyField] = invoice[partyField];
        movement.invoiceId = String(invoice._id);
        Object.assign(movement, cheque.fields);
        const saved = new Movement(movement);
        await saved.save({ session });
        await new AttemptModel({ _id: attemptKey, resource, actor, fingerprint, movementId: saved._id, createdAt: new Date() }).save({ session });
        return { resultado: saved, idempotentReplay: false };
      });
    } catch (error) {
      if (error?.code === 11000) {
        const prior = await AttemptModel.findById(attemptKey).lean();
        if (prior) {
          if (prior.resource !== resource || prior.actor !== actor || prior.fingerprint !== fingerprint) return { error: 'idempotency_conflict' };
          const original = await Movement.findById(prior.movementId).lean();
          if (original) return { resultado: original, idempotentReplay: true };
          return { error: 'idempotency_record_inconsistent' };
        }
      }
      throw error;
    }
  };
}


module.exports = managementMovementCreate;
module.exports.cents = cents;

module.exports.runTransaction = runTransaction;
