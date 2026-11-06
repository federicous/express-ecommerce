const { runTransaction } = require('./managementMovementCreate');
const { chequeFilter } = require('./managementChequeUse');

// Use the same shared document as movement creation. Checking links and deleting
// in one snapshot without a shared write would still permit orphaned movements.
module.exports = function managementChequeDelete(Cheque, Collection, Payment) {
  return async function remove(id) {
    return runTransaction(Cheque, async (session) => {
      const cheque = await Cheque.findOneAndUpdate({ _id: id },
        { $inc: { __v: 1 } }, { new: true, session }).lean();
      if (!cheque) return { error: 'not_found' };
      const filter = chequeFilter(cheque);
      if (await Collection.exists(filter).session(session)
        || await Payment.exists(filter).session(session)) return { error: 'linked_cheque' };
      const removed = await Cheque.findOneAndDelete({ _id: cheque._id, __v: cheque.__v }, { session }).lean();
      return removed ? { removed: true } : { error: 'stale_cheque' };
    });
  };
};
