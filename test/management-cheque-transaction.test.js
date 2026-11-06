const assert = require('node:assert/strict');
const test = require('node:test');
const remove = require('../utils/managementChequeDelete');
const { managementChequeUse } = require('../utils/managementChequeUse');

function fixture({ linked = false, missing = false, unsupported = false, commitError } = {}) {
  const events = [];
  const cheque = { _id: '123456789012345678901234', __v: 3, code: 'CHEQUE', linkVersion: 'd04', tipo: 'cheque', monto: '40.25', cliente: 'CLIENT' };
  const session = {
    async withTransaction(work) {
      if (unsupported) throw Object.assign(new Error('standalone'), { code: 20 });
      await work();
      if (commitError) throw commitError;
      events.push('commit');
    },
    async endSession() { events.push('end'); },
  };
  const query = (value, event) => ({
    session(actual) { assert.equal(actual, session); return this; },
    limit() { return this; },
    async lean() { events.push(event); return value; },
    then(resolve, reject) { return this.lean().then(resolve, reject); },
  });
  const Cheque = {
    db: { async startSession() { return session; } },
    findOneAndUpdate(filter, update, options) {
      assert.equal(filter._id, cheque._id);
      assert.deepEqual(update, { $inc: { __v: 1 } });
      assert.equal(options.session, session);
      assert.equal(options.new, true);
      return query(missing ? null : cheque, 'cheque-fence');
    },
    find() { return query([cheque], 'read-code'); },
    findOneAndDelete(filter, options) {
      assert.deepEqual(filter, { _id: cheque._id, __v: cheque.__v });
      assert.equal(options.session, session);
      return query(cheque, 'delete');
    },
  };
  const Collection = {
    exists() { return query(linked, 'read-receipt'); },
    find() { return query([], 'read-receipt'); },
  };
  const Payment = { exists() { return query(false, 'read-payment'); } };
  return { events, cheque, session, Cheque, Collection, Payment,
    remove: () => remove(Cheque, Collection, Payment)(cheque._id) };
}

test('cheque use fences shared document before consulting receipt and delivery in the movement session', async () => {
  const f = fixture();
  const result = await managementChequeUse(f.Cheque, f.Collection, f.Payment, 'in')(
    { medioDePago: 'cheque', cheque: f.cheque._id }, 4025n, { cliente: 'CLIENT' }, f.session);
  assert.deepEqual(result.fields, { chequeId: f.cheque._id, cheque: 'CHEQUE' });
  assert.deepEqual(f.events, ['cheque-fence', 'read-code', 'read-receipt', 'read-payment']);
});

test('non-cheque medium never fences a cheque', async () => {
  const f = fixture();
  assert.deepEqual(await managementChequeUse(f.Cheque, f.Collection, f.Payment, 'in')(
    { medioDePago: 'efectivo' }, 4025n, {}, f.session), { fields: {} });
  assert.deepEqual(f.events, []);
});

test('cheque delete fences, reads references and deletes version inside one transaction, returns only after commit', async () => {
  const f = fixture();
  assert.deepEqual(await f.remove(), { removed: true });
  assert.deepEqual(f.events, ['cheque-fence', 'read-receipt', 'read-payment', 'delete', 'commit', 'end']);
});

test('linked cheque rejection aborts without delete or commit', async () => {
  const f = fixture({ linked: true });
  assert.deepEqual(await f.remove(), { error: 'linked_cheque' });
  assert.deepEqual(f.events, ['cheque-fence', 'read-receipt', 'end']);
});

test('missing cheque aborts without checking links or committing', async () => {
  const f = fixture({ missing: true });
  assert.deepEqual(await f.remove(), { error: 'not_found' });
  assert.deepEqual(f.events, ['cheque-fence', 'end']);
});

test('standalone cheque delete fails closed without fallback', async () => {
  const f = fixture({ unsupported: true });
  assert.deepEqual(await f.remove(), { error: 'atomicity_unavailable' });
  assert.deepEqual(f.events, ['end']);
});

test('unacknowledged cheque delete commit never reports success', async () => {
  const error = new Error('commit lost');
  const f = fixture({ commitError: error });
  await assert.rejects(f.remove(), (caught) => caught === error);
  assert.equal(f.events.includes('commit'), false);
  assert.equal(f.events.at(-1), 'end');
});
