const assert = require('node:assert/strict');
const test = require('node:test');
const express = require('express');
const request = require('supertest');
const jwt = require('jsonwebtoken');
process.env.NODE_ENV = 'test';
const auth = require('../middleware/autenticacion');
const secret = require('../config').autenticacion.JWT_SECRET;
const { createAttemptRecoveryHandler, classifyAttempt } = require('../routes/managementAttemptRecovery');
const key = '12345678-1234-4234-8234-123456789abc';
const url = `/api/management/attempts/cobroClientes/${key}`;
const token = (actor = 'operator-a', isAdmin = true, expiresIn = '1h') =>
  jwt.sign({ id: actor, isAdmin }, secret, { expiresIn });
function app(reader) {
  const server = express();
  server.get('/api/management/attempts/:resource/:key', auth.administrador, createAttemptRecoveryHandler(reader));
  return server;
}
const attempt = { movementId: 'm1', fingerprint: 'a'.repeat(64) };
const movement = { _id: 'm1', invoiceId: 'i1', code: 'V-1', cliente: 'Client', monto: '40.25', fecha: '2026-10-01', medioDePago: 'efectivo', name: 'private' };
const invoice = { _id: 'i1', code: 'V-1', cliente: 'Client' };

test('recovery requires current admin session, including expiry and valid actor', async () => {
  let reads = 0;
  const server = app(async () => { reads++; return { status: 'not_confirmed' }; });
  assert.equal((await request(server).get(url)).status, 401);
  for (const [value, status] of [[token('operator-a', false), 403], [token('operator-a', true, -1), 401], [token(''), 403]]) {
    assert.equal((await request(server).get(url).set('Authorization', `Bearer ${value}`)).status, status);
  }
  assert.equal(reads, 0);
});

test('recovery uses authenticated actor, exact resource/key and disables cache', async () => {
  let received;
  const server = app(async input => { received = input; return { status: 'not_confirmed' }; });
  const response = await request(server).get(`${url}?actor=operator-b`).set('Authorization', `Bearer ${token()}`);
  assert.equal(response.status, 200);
  assert.equal(response.headers['cache-control'], 'no-store');
  assert.deepEqual(received, { actor: 'operator-a', resource: 'cobroClientes', key });
  assert.deepEqual(response.body, { status: 'not_confirmed', key, resource: 'cobroClientes' });
});

test('invalid recovery identity/resources are rejected without querying', async () => {
  let reads = 0;
  const server = app(async () => { reads++; return {}; });
  for (const path of [`/api/management/attempts/pagos/bad`, `/api/management/attempts/gastos/${key}`, `/api/management/attempts/constructor/${key}`]) {
    assert.equal((await request(server).get(path).set('Authorization', `Bearer ${token()}`)).status, 400);
  }
  assert.equal(reads, 0);
});

test('confirmed movement exposes only summary and never local completion permission on absence', () => {
  assert.deepEqual(classifyAttempt(attempt, movement, invoice, { party: 'cliente' }), {
    status: 'confirmed', movement: { id: 'm1', code: 'V-1', amount: '40.25', date: '2026-10-01', paymentMethod: 'efectivo' },
  });
});

test('missing or contradictory movement/reference is inconsistent, not confirmed', () => {
  const classify = (a, m, i) => classifyAttempt(a, m, i, { party: 'cliente' });
  for (const [a, m, i] of [
    [attempt, null, invoice], [attempt, movement, null],
    [{ ...attempt, fingerprint: 'bad' }, movement, invoice],
    [attempt, { ...movement, _id: 'other' }, invoice],
    [attempt, { ...movement, invoiceId: 'other' }, invoice],
    [attempt, { ...movement, code: 'V-2' }, invoice],
    [attempt, { ...movement, cliente: 'Other' }, invoice],
    [attempt, { ...movement, monto: '0' }, invoice],
    [attempt, { ...movement, monto: '40.255' }, invoice],
  ]) assert.deepEqual(classify(a, m, i), { status: 'inconsistent' });
});

test('payment summary follows same checks without leaking supplier identity', () => {
  const payment = { ...movement, proveedor: 'Supplier' };
  const purchase = { ...invoice, proveedor: 'Supplier' };
  const result = classifyAttempt(attempt, payment, purchase, { party: 'proveedor' });
  assert.equal(result.status, 'confirmed');
  assert.equal(result.movement.proveedor, undefined);
});

test('read failures stay unavailable, never absence or confirmed', async () => {
  const response = await request(app(async () => { throw new Error('private database details'); }))
    .get(url).set('Authorization', `Bearer ${token()}`);
  assert.equal(response.status, 503);
  assert.equal(response.body.error, 'recovery_unavailable');
  assert.ok(!JSON.stringify(response.body).includes('private'));
});

test('recovery is GET-only; it cannot delete attempts or create movements', async () => {
  let reads = 0;
  const server = app(async () => { reads++; return {}; });
  for (const method of ['post', 'put', 'delete']) {
    assert.equal((await request(server)[method](url).set('Authorization', `Bearer ${token()}`)).status, 404);
  }
  assert.equal(reads, 0);
});

// Injected model fixtures verify query scoping/snapshot lifecycle, not Mongo integration.
const { readAttempt } = require('../routes/managementAttemptRecovery');
for (const found of [true, false]) {
  test(`snapshot lookup scopes actor/resource/key and closes session (found=${found})`, async () => {
    let filter, ended = false, txOptions, reads = 0;
    const session = { async withTransaction(work, options) { txOptions = options; await work(); }, async endSession() { ended = true; } };
    const query = value => ({ session(valueSession) { assert.equal(valueSession, session); return { async lean() { return value; } }; } });
    const dependencies = {
      Attempt: { db: { async startSession() { return session; } }, findOne(value) { filter = value; return query(found ? attempt : null); } },
      resources: { cobroClientes: { party: 'cliente',
        Movement: { collection: { collectionName: 'cobroclientes' }, findById(id) { reads++; assert.equal(id, 'm1'); return query(movement); } },
        Invoice: { findById(id) { reads++; assert.equal(id, 'i1'); return query(invoice); } },
      } },
    };
    const result = await readAttempt({ key, actor: 'operator-a', resource: 'cobroClientes' }, dependencies);
    assert.deepEqual(filter, { _id: key, actor: 'operator-a', resource: 'cobroclientes' });
    assert.equal(result.status, found ? 'confirmed' : 'not_confirmed');
    assert.equal(reads, found ? 2 : 0);
    assert.equal(txOptions.readConcern.level, 'snapshot');
    assert.equal(txOptions.readPreference, 'primary');
    assert.ok(ended);
  });
}

test('snapshot errors close the session and propagate rather than inventing absence', async () => {
  let ended = false;
  const dependencies = { Attempt: { db: { async startSession() {
    return { async withTransaction() { throw new Error('snapshot unavailable'); }, async endSession() { ended = true; } };
  } } }, resources: { pagos: {} } };
  await assert.rejects(readAttempt({ key, actor: 'operator-a', resource: 'pagos' }, dependencies), /snapshot unavailable/);
  assert.ok(ended);
});
