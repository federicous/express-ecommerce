const assert = require('node:assert/strict');
const Module = require('node:module');
const test = require('node:test');
const express = require('express');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { mkdtemp, readdir, rm } = require('node:fs/promises');
const { tmpdir } = require('node:os');
const { join } = require('node:path');

process.env.NODE_ENV = 'test';
const resources = [
  ['facturaCliente', 'facturaCliente'], ['cobroCliente', 'cobroCliente'],
  ['facturaProveedor', 'facturaProveedor'], ['pagos', 'pagos'],
  ['cheques', 'cheque'], ['gastos', 'gastos'],
  ['devoluciones', 'devoluciones'], ['pendientes', 'pendientes'],
];
const outcomes = {};
const controllers = new Map(resources.map(([dir, name]) => [
  require.resolve(`../components/${dir}/controllers/${name}Controller`), dir,
]));
const routers = new Set(resources.map(([dir]) => require.resolve(`../components/${dir}`)));
const originalLoad = Module._load;
Module._load = function isolatedServices(name, parent, isMain) {
  if (name.includes('logger/pino')) return { info() {}, error() {} };
  if (controllers.has(parent?.filename) && name === '../services') {
    const resource = controllers.get(parent.filename);
    return { async save() {
      const outcome = outcomes[resource];
      if (outcome instanceof Error) throw outcome;
      return outcome;
    } };
  }
  if (routers.has(parent?.filename) && name === '../../utils/multer') {
    return { single: () => (_req, _res, next) => next() };
  }
  return originalLoad.call(this, name, parent, isMain);
};
const app = express();
let managementCreate;
let token;
try {
  app.use(express.json());
  for (const router of routers) require(router)(app);
  managementCreate = require('../utils/managementCreate');
  token = jwt.sign({ isAdmin: true }, require('../config').autenticacion.JWT_SECRET);
} finally {
  Module._load = originalLoad;
}

for (const [dir, name] of resources) {
  test(`${dir} POST reports confirmed persistence and rejects false success`, async () => {
    const post = () => {
      const requestPost = request(app).post(`/api/${name}/`).set('Authorization', `Bearer ${token}`);
      if (['cobroCliente', 'pagos'].includes(name)) requestPost.set('Idempotency-Key', '123e4567-e89b-42d3-a456-426614174000');
      return requestPost.send({ code: 'SYNTHETIC' });
    };

    outcomes[dir] = { resultado: { _id: 'saved', code: 'SYNTHETIC' } };
    const success = await post();
    assert.equal(success.status, 200);
    assert.equal(success.body.result, 'ok');
    assert.equal(success.body.response._id, 'saved');
    assert.equal(success.body.new.idempotencyKey, undefined);

    for (const [outcome, status, error] of [
      [{ error: 'duplicate_code', message: 'legacy text' }, 409, 'duplicate_code'],
      [{ error: 'reference_not_found' }, 422, 'reference_not_found'],
      [{ error: 'ambiguous_reference' }, 409, 'ambiguous_reference'],
      [{ error: 'reference_mismatch' }, 409, 'reference_mismatch'],
      [{ error: 'idempotency_conflict' }, 409, 'idempotency_conflict'],
      [{ error: 'idempotency_record_inconsistent' }, 409, 'idempotency_record_inconsistent'],
      [{ error: 'invalid_reference' }, 400, 'invalid_reference'],
      [{ error: 'invalid_amount' }, 400, 'invalid_amount'],
      [{ error: 'invalid_existing_balance' }, 409, 'invalid_existing_balance'],
      [{ error: 'amount_exceeds_balance' }, 409, 'amount_exceeds_balance'],
      [{ error: 'invalid_cheque_reference' }, 400, 'invalid_cheque_reference'],
      [{ error: 'invalid_cheque_record' }, 400, 'invalid_cheque_record'],
      [{ error: 'cheque_history_unverified' }, 409, 'cheque_history_unverified'],
      [{ error: 'cheque_not_found' }, 422, 'cheque_not_found'],
      [{ error: 'ambiguous_cheque' }, 409, 'ambiguous_cheque'],
      [{ error: 'cheque_type_mismatch' }, 409, 'cheque_type_mismatch'],
      [{ error: 'cheque_amount_mismatch' }, 409, 'cheque_amount_mismatch'],
      [{ error: 'cheque_party_mismatch' }, 409, 'cheque_party_mismatch'],
      [{ error: 'cheque_already_used' }, 409, 'cheque_already_used'],
      [{ error: 'cheque_not_received' }, 409, 'cheque_not_received'],
      [{ message: 'unconfirmed' }, 500, 'internal_error'],
      [undefined, 500, 'internal_error'],
      [Object.assign(new Error('private database detail'), { name: 'ValidationError' }), 400, 'validation_error'],
      [new Error('private database detail'), 500, 'internal_error'],
    ]) {
      outcomes[dir] = outcome;
      const rejected = await post();
      assert.equal(rejected.status, status);
      assert.match(rejected.headers['content-type'], /json/);
      assert.equal(rejected.body.error, error);
      assert.equal(rejected.body.result, undefined);
      assert.ok(!JSON.stringify(rejected.body).includes('private database detail'));
    }
  });
}

for (const path of ['/api/cobroCliente/', '/api/pagos/']) {
  test(`${path} preserves keyless legacy callers but rejects malformed keys`, async () => {
    const post = () => request(app).post(path).set('Authorization', `Bearer ${token}`).send({ code: 'SYNTHETIC' });
    outcomes[path.includes('pagos') ? 'pagos' : 'cobroCliente'] = { resultado: { _id: 'saved-legacy', code: 'SYNTHETIC' } };
    const legacy = await post();
    assert.equal(legacy.status, 200);
    assert.equal(legacy.body.result, 'ok');
    const invalid = await request(app).post(path).set('Authorization', `Bearer ${token}`)
      .set('Idempotency-Key', 'not-a-uuid').send({ code: 'SYNTHETIC' });
    assert.equal(invalid.status, 400);
    assert.equal(invalid.body.error, 'idempotency_key_required');
  });
}

test('known rejected creation removes its uploaded file', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'gestion-create-rejected-'));
  try {
    const uploadApp = express();
    uploadApp.post('/document', multer({ dest: directory }).single('image'),
      (req, res) => managementCreate({ save: async () => ({ error: 'duplicate_code' }) }, req, res));
    const response = await request(uploadApp).post('/document')
      .field('code', 'DUPLICATE').attach('image', Buffer.from('synthetic'), 'sample.png');
    assert.equal(response.status, 409);
    assert.deepEqual(await readdir(directory), []);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
