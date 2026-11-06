const assert = require('node:assert/strict');
const test = require('node:test');
const create = require('../utils/managementMovementCreate');

const keyA = '123e4567-e89b-42d3-a456-426614174000';
const keyB = '123e4567-e89b-42d3-a456-426614174001';

function fixture({ committedError, queryError, invoiceAmount = '100.50' } = {}) {
  const events = [];
  const movements = [];
  const attempts = new Map();
  const invoice = { _id: 'synthetic-id', code: 'SALE', cliente: 'CLIENT', monto: invoiceAmount };
  const session = {
    async withTransaction(work, options) {
      assert.equal(options.readConcern.level, 'snapshot');
      assert.equal(options.writeConcern.w, 'majority');
      await work();
      if (committedError) throw committedError;
      events.push('commit');
    },
    async endSession() { events.push('end'); },
  };
  const query = (value, event) => ({
    session(actual) { assert.equal(actual, session); return this; },
    limit() { return this; },
    async lean() { if (event) events.push(event); if (queryError) throw queryError; return typeof value === 'function' ? value() : value; },
  });
  class Movement {
    constructor(data) { Object.assign(this, data); }
    static schema = { paths: Object.fromEntries(['code', 'cliente', 'monto', 'fecha', 'medioDePago', 'cheque', 'timestamp', 'invoiceId', 'chequeId'].map((field) => [field, {}])) };
    static collection = { collectionName: 'cobroClientes' };
    static find() { return query(() => movements, 'read-movements'); }
    static findById(id) { return query(() => movements.find((row) => row._id === id) || null, 'read-original'); }
    async save(options) {
      assert.equal(options.session, session);
      const row = { _id: `movement-${movements.length + 1}`, ...this };
      this._id = row._id;
      movements.push(row);
      events.push('insert-movement');
      return row;
    }
  }
  class AttemptModel {
    static collection = {};
    static createCollection() { events.push('create-attempt-collection'); return Promise.resolve(this.collection); }
    static findById(id) { return query(() => attempts.get(id) || null, 'read-attempt'); }
    constructor(data) { Object.assign(this, data); }
    async save(options) {
      assert.equal(options.session, session);
      attempts.set(this._id, { ...this });
      events.push('insert-attempt');
    }
  }
  const Invoice = {
    db: { async startSession() { return session; } },
    find() { return query([invoice]); },
    findOneAndUpdate(filter, change, options) {
      assert.equal(filter._id, invoice._id);
      assert.deepEqual(change, { $inc: { __v: 1 } });
      assert.equal(options.session, session);
      events.push('fence');
      return query(invoice);
    },
  };
  const saveMovement = create(Movement, Invoice, 'cliente',
    async (_payload, _amount, _invoice, actual) => {
      assert.equal(actual, session); return { fields: {} };
    }, AttemptModel);
  const save = (payload = { code: 'SALE', monto: '20.25', cliente: 'CLIENT' }) =>
    saveMovement({ ...payload,
      idempotencyKey: Object.hasOwn(payload, 'idempotencyKey') ? payload.idempotencyKey : keyA,
      idempotencyActor: Object.hasOwn(payload, 'idempotencyActor') ? payload.idempotencyActor : 'synthetic-user' });
  return { save, events, movements, attempts };
}

test('movement fences invoice before reading balance and only returns after commit', async () => {
  const { save, events } = fixture();
  assert.equal((await save()).resultado.invoiceId, 'synthetic-id');
  assert.deepEqual(events.filter((event) => !event.startsWith('create-')),
    ['read-attempt', 'fence', 'read-movements', 'insert-movement', 'insert-attempt', 'commit', 'end']);
});

test('same key and same payload returns original movement without inserting twice', async () => {
  const { save, movements, events } = fixture();
  const first = await save();
  const replay = await save();
  assert.equal(first.resultado._id, replay.resultado._id);
  assert.equal(first.idempotentReplay, false);
  assert.equal(replay.idempotentReplay, true);
  assert.equal(movements.length, 1);
  assert.equal(events.filter((event) => event === 'fence').length, 1);
});

test('same key with changed payload is rejected; a new key allows a legitimate equal movement', async () => {
  const { save, movements } = fixture();
  const first = await save();
  assert.deepEqual(await save({ code: 'SALE', monto: '20.26', cliente: 'CLIENT' }),
    { error: 'idempotency_conflict' });
  const second = await save({ code: 'SALE', monto: '20.25', cliente: 'CLIENT', idempotencyKey: keyB });
  assert.notEqual(first.resultado._id, second.resultado._id);
  assert.equal(movements.length, 2);
});

test('missing and malformed keys fail before opening a database session', async () => {
  const { save } = fixture();
  assert.deepEqual(await save({ code: 'SALE', monto: '20.25', idempotencyKey: '' }),
    { error: 'invalid_idempotency_key' });
});

test('client cannot alter identity, timestamp or references that the server derives', async () => {
  for (const field of ['_id', 'id', 'timestamp', 'invoiceId', 'chequeId']) {
    const { save, events } = fixture();
    assert.deepEqual(await save({ code: 'SALE', monto: '20.25', cliente: 'CLIENT', [field]: 'forged' }),
      { error: field === 'chequeId' ? 'invalid_cheque_reference' : 'invalid_reference' }, field);
    assert.equal(events.includes('fence'), false, field);
  }
});

test('attempt identity is isolated by authenticated actor', async () => {
  const { save } = fixture();
  await save();
  assert.deepEqual(await save({ code: 'SALE', monto: '20.25', cliente: 'CLIENT', idempotencyActor: 'other-user' }),
    { error: 'idempotency_conflict' });
});

test('transaction commit failure never produces a successful movement outcome', async () => {
  const error = new Error('commit not acknowledged');
  const { save, events } = fixture({ committedError: error });
  await assert.rejects(save(), (caught) => caught === error);
  assert.ok(events.includes('insert-movement'));
  assert.ok(!events.includes('commit'));
  assert.equal(events.at(-1), 'end');
});

test('business rejection aborts without inserting movement or attempt', async () => {
  const { save, events, movements, attempts } = fixture();
  assert.deepEqual(await save({ code: 'SALE', monto: '101.00', cliente: 'CLIENT' }),
    { error: 'amount_exceeds_balance' });
  assert.deepEqual(movements, []);
  assert.equal(attempts.size, 0);
  assert.ok(!events.includes('commit'));
});

test('unsupported transactions fail closed without unsafe fallback', async () => {
  const { save, events } = fixture({ queryError: Object.assign(new Error('standalone'), { code: 20 }) });
  assert.deepEqual(await save(), { error: 'atomicity_unavailable' });
  assert.ok(!events.includes('insert-movement'));
  assert.ok(!events.includes('commit'));
  assert.equal(events.at(-1), 'end');
});
