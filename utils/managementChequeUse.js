const mongoose = require('mongoose');
const { cents } = require('./managementMovementCreate');

const chequeMedia = new Set(['cheque', 'e-cheq']);
const chequeFilter = (cheque) => ({ $or: [
  { chequeId: String(cheque._id) }, { cheque: cheque.code },
] });

// A cheque is identified by its Mongo ID, not its visible number. The server
// derives the stored ID/code after checking its one-in/one-out use.
function managementChequeUse(Cheque, Collection, Payment, direction) {
  return async function resolve(payload, amount, invoice, session) {
    const medium = payload.medioDePago;
    const supplied = payload.cheque;
    if (Object.hasOwn(payload, 'chequeId')) return { error: 'invalid_cheque_reference' };
    if (!chequeMedia.has(medium)) {
      return supplied ? { error: 'invalid_cheque_reference' } : { fields: {} };
    }
    if (typeof supplied !== 'string' || !/^[a-f\d]{24}$/i.test(supplied)
      || !mongoose.isValidObjectId(supplied)) return { error: 'invalid_cheque_reference' };
    // Shared write fence: different invoices must still serialize on this cheque.
    // The enclosing movement transaction rolls this revision back on rejection.
    const cheque = await Cheque.findOneAndUpdate({ _id: supplied },
      { $inc: { __v: 1 } }, { new: true, session }).lean();
    if (!cheque) return { error: 'cheque_not_found' };
    // Old payments did not persist cheque at all. Availability of an old
    // cheque cannot be inferred from a code-only search: fail closed.
    if (cheque.linkVersion !== 'd04') return { error: 'cheque_history_unverified' };
    const matchingCodes = await Cheque.find({ code: cheque.code }).session(session).limit(2).lean();
    if (matchingCodes.length !== 1) return { error: 'ambiguous_cheque' };
    if (cheque.tipo !== medium) return { error: 'cheque_type_mismatch' };
    const chequeAmount = cents(cheque.monto);
    if (chequeAmount === null || chequeAmount <= 0n || chequeAmount !== amount) {
      return { error: 'cheque_amount_mismatch' };
    }
    const filter = chequeFilter(cheque);
    const receipt = await Collection.find(filter).session(session).limit(2).lean();
    const delivered = await Payment.exists(filter).session(session);
    if (direction === 'in') {
      if (cheque.cliente !== invoice.cliente) return { error: 'cheque_party_mismatch' };
      if (receipt.length || delivered) return { error: 'cheque_already_used' };
    } else {
      if (delivered) return { error: 'cheque_already_used' };
      if (!receipt.length) return { error: 'cheque_not_received' };
      if (receipt.length !== 1 || receipt[0].medioDePago !== medium
        || cents(receipt[0].monto) !== chequeAmount
        || receipt[0].cliente !== cheque.cliente
        || receipt[0].chequeId !== String(cheque._id)) {
        return { error: 'ambiguous_cheque' };
      }
    }
    return { fields: { chequeId: String(cheque._id), cheque: cheque.code } };
  };
}

module.exports = { managementChequeUse, chequeFilter };
