const { validateDocument } = require('./managementDocumentInput');
const mongoose = require('mongoose');
const pino = require('./logger/pino');

class WriteRejection extends Error {
  constructor(status, error, message) {
    super(message);
    this.status = status;
    this.error = error;
  }
}

// The legacy movement relation is code-only. Therefore *any* movement with
// the original code blocks protected changes, even when party data differs.
function managementLinkedInvoice(invoiceModel, movementModel, partyField, otherLinkedModels = []) {
  const protectedFields = ['code', partyField, 'monto'];
  const allowedFields = new Set(Object.keys(invoiceModel.schema.paths).filter((field) =>
    !['_id', '__v', 'timestamp'].includes(field)));

  function validId(id) {
    if (typeof id !== 'string' || !/^[a-f\d]{24}$/i.test(id) || !mongoose.isValidObjectId(id)) {
      throw new WriteRejection(400, 'invalid_id', 'El identificador no es válido');
    }
  }

  async function load(id) {
    validId(id);
    const invoice = await invoiceModel.findById(id).lean();
    if (!invoice) throw new WriteRejection(404, 'not_found', 'No existe el comprobante');
    return invoice;
  }

  async function hasLinkedMovement(invoice) {
    const reference = { $or: [{ invoiceId: String(invoice._id) }, { code: invoice.code }] };
    for (const model of [movementModel, ...otherLinkedModels]) {
      if (await model.exists(reference)) return true;
    }
    return false;
  }

  function fields(body, id) {
    if (!body || typeof body !== 'object' || Array.isArray(body) || body._id && body._id !== id) {
      throw new WriteRejection(400, 'invalid_payload', 'Los datos de edición no son válidos');
    }
    const changes = {};
    for (const [key, value] of Object.entries(body)) {
      if (['_id', '__v', 'isNew', 'timestamp'].includes(key)) continue;
      const normalized = key === 'monto' && typeof value === 'number' && Number.isFinite(value)
        ? String(value) : value;
      if (!allowedFields.has(key) || typeof normalized !== 'string') {
        throw new WriteRejection(400, 'invalid_payload', 'Los datos de edición no son válidos');
      }
      changes[key] = normalized;
    }
    if (!Object.keys(changes).length) {
      throw new WriteRejection(400, 'invalid_payload', 'No hay campos editables');
    }
    const rejection = validateDocument(changes, { partial: true });
    if (rejection) throw new WriteRejection(400, rejection,
      rejection === 'invalid_amount' ? 'El importe debe ser positivo y tener como máximo dos decimales'
        : 'Ingresá una fecha válida en formato DD/MM/AAAA');
    return changes;
  }

  // The movement transaction increments __v. A change since the linkage read
  // must reject the edit/delete instead of invalidating a newly committed movement.
  function revision(invoice) {
    return Object.hasOwn(invoice, '__v') ? invoice.__v : { $exists: false };
  }

  async function update(id, body) {
    const current = await load(id);
    const changes = fields(body, id);
    const sameAmount = (left, right) => {
      if (left === right) return true;
      const pattern = /^-?\d+(?:\.\d{1,2})?$/;
      if (!pattern.test(left || '') || !pattern.test(right || '')) return false;
      const asCents = (amount) => {
        const negative = amount.startsWith('-');
        const [whole, fraction = ''] = amount.replace(/^-/, '').split('.');
        const value = BigInt(whole) * 100n + BigInt(fraction.padEnd(2, '0'));
        return negative ? -value : value;
      };
      return asCents(left) === asCents(right);
    };
    const changesProtected = protectedFields.some((field) => Object.hasOwn(changes, field)
      && (field === 'monto' ? !sameAmount(changes[field], current[field]) : changes[field] !== current[field]));
    if (changesProtected && await hasLinkedMovement(current)) {
      throw new WriteRejection(409, 'linked_movements', 'El comprobante tiene movimientos vinculados y no permite cambiar código, parte o importe');
    }
    if (changes.code !== undefined && changes.code !== current.code
      && await invoiceModel.exists({ code: changes.code, _id: { $ne: current._id } })) {
      throw new WriteRejection(409, 'duplicate_code', 'Ya existe un comprobante con ese código');
    }
    // Compare the revision as well as protected fields; participate in the fence.
    const filter = { _id: current._id, __v: revision(current) };
    for (const field of protectedFields) filter[field] = current[field] ?? null;
    const saved = await invoiceModel.findOneAndUpdate(filter,
      { $set: { ...changes, timestamp: Date.now() }, $inc: { __v: 1 } }, { new: true, runValidators: true });
    if (!saved) throw new WriteRejection(409, 'stale_invoice', 'El comprobante cambió; recargá la lista');
    return saved;
  }

  async function remove(id) {
    const current = await load(id);
    if (await hasLinkedMovement(current)) {
      throw new WriteRejection(409, 'linked_movements', 'El comprobante tiene movimientos vinculados y no puede borrarse');
    }
    const removed = await invoiceModel.findOneAndDelete({ _id: current._id, __v: revision(current), code: current.code,
      [partyField]: current[partyField] ?? null, monto: current.monto ?? null });
    if (!removed) throw new WriteRejection(409, 'stale_invoice', 'El comprobante cambió; recargá la lista');
    return removed;
  }

  function respondError(error, res) {
    if (error instanceof WriteRejection) {
      return res.status(error.status).json({ error: error.error, message: error.message });
    }
    pino.error(`Error de modificación de comprobante: ${error}`);
    const validation = error?.name === 'ValidationError' || error?.name === 'CastError';
    return res.status(validation ? 400 : 500).json({
      error: validation ? 'validation_error' : 'internal_error',
      message: validation ? 'Los datos del comprobante no son válidos' : 'No se pudo completar la operación',
    });
  }

  return {
    async updateById(req, res) {
      try {
        const saved = await update(req.params.id, req.body);
        return res.status(200).json({ result: 'ok', response: saved });
      } catch (error) { return respondError(error, res); }
    },
    async updateRoot(req, res) {
      try {
        const saved = await update(req.body?._id, req.body);
        return res.status(200).json({ result: 'ok', response: saved });
      } catch (error) { return respondError(error, res); }
    },
    async deleteById(req, res) {
      try {
        const removed = await remove(req.params.id);
        return res.status(200).json({ result: 'ok', id: String(removed._id) });
      } catch (error) { return respondError(error, res); }
    },
  };
}

module.exports = managementLinkedInvoice;
