const assert = require('node:assert/strict');
const Module = require('node:module');
const test = require('node:test');
const express = require('express');
const request = require('supertest');
const jwt = require('jsonwebtoken');

process.env.NODE_ENV = 'test';
const resources = [
  ['facturaCliente', 'facturaCliente'], ['cobroCliente', 'cobroCliente'],
  ['facturaProveedor', 'facturaProveedor'], ['pagos', 'pagos'],
  ['cheques', 'cheque'], ['gastos', 'gastos'], ['devoluciones', 'devoluciones'], ['pendientes', 'pendientes'],
];
const states = Object.fromEntries(resources.map(([dir]) => [dir, { calls: 0 }]));
const controllers = new Map(resources.map(([dir, name]) => [require.resolve(`../components/${dir}/controllers/${name}Controller`), dir]));
const routers = new Set(resources.map(([dir]) => require.resolve(`../components/${dir}`)));
const originalLoad = Module._load;
const authModule = require.resolve('../middleware/autenticacion');
const users = { manager: { enable: 'on', isManagement: 'on' }, administrator: { enable: 'on', isAdmin: 'on', isManagement: 'off' } };
Module._load = function syntheticServices(name, parent, isMain) {
  if (name.includes('logger/pino')) return { info() {}, error() {} };
  if (parent?.filename === authModule && name === '../schema/usuarios') return { findById: id => ({ select: () => ({ lean: async () => users[id] || null }) }) };
  if (controllers.has(parent?.filename) && name === '../services') {
    const state = states[controllers.get(parent.filename)];
    return { async getAll() {
      state.calls += 1;
      if (state.outcome instanceof Error) throw state.outcome;
      return state.outcome;
    } };
  }
  if (routers.has(parent?.filename) && name === '../../utils/multer') return { single: () => (_req, _res, next) => next() };
  return originalLoad.call(this, name, parent, isMain);
};
const app = express();
let secret;
try {
  for (const router of routers) require(router)(app);
  secret = require('../config').autenticacion.JWT_SECRET;
} finally { Module._load = originalLoad; }

for (const [dir, route] of resources) {
  test(`${dir} GET distinguishes empty/data from failed reads and preserves authorization`, async () => {
    const state = states[dir];
    const read = (token) => {
      const pending = request(app).get(`/api/${route}/`);
      return token ? pending.set('Authorization', `Bearer ${token}`) : pending;
    };
    assert.equal((await read()).status, 401);
    assert.equal((await read(jwt.sign({ id: 'administrator', isAdmin: true, isManagement: false }, secret))).status, 403);
    assert.equal((await read(jwt.sign({ id: 'manager', isManagement: true }, secret, { expiresIn: -1 }))).status, 401);
    assert.equal(state.calls, 0);
    const token = jwt.sign({ id: 'manager', isAdmin: false, isManagement: true }, secret);
    for (const outcome of [{ resultado: [] }, { resultado: [{ _id: 'synthetic', code: 'CODE' }], message: 'legacy envelope' }]) {
      state.outcome = outcome;
      const response = await read(token);
      assert.equal(response.status, 200);
      assert.deepEqual(response.body, outcome);
      assert.equal(response.headers['cache-control'], 'no-store');
    }
    for (const outcome of [undefined, {}, { resultado: null }, { resultado: {} },
      { resultado: [], error: 'failed' }, new Error('private database credentials')]) {
      state.outcome = outcome;
      const response = await read(token);
      assert.equal(response.status, 500);
      assert.match(response.headers['content-type'], /json/);
      assert.equal(response.headers['cache-control'], 'no-store');
      assert.deepEqual(response.body, { error: 'internal_error', message: 'No se pudo consultar la lista' });
      assert.ok(!response.text.includes('private database'));
    }
  });
}
