const assert = require('node:assert/strict');
const Module = require('node:module');
const test = require('node:test');
const express = require('express');
const jwt = require('jsonwebtoken');
const request = require('supertest');

process.env.NODE_ENV = 'test';

const routerModule = require.resolve('../components/facturaCliente');
const authModule = require.resolve('../middleware/autenticacion');
const originalLoad = Module._load;
const users = {
  'management-user': { enable: 'on', isManagement: 'on' },
  'administrator-user': { enable: 'on', isAdmin: 'on', isManagement: 'off' },
  'disabled-user': { enable: 'off', isManagement: 'on' },
  'buyer-user': { enable: 'on', isManagement: 'off' },
};
Module._load = function stubPersistence(name, parent, isMain) {
  if (name.includes('utils/logger/pino')) {
    return { info() {}, error() {}, warn() {}, debug() {} };
  }
  if (parent?.filename === authModule && name === '../schema/usuarios') {
    return { findById: id => ({ select: () => ({ lean: async () => users[id] || null }) }) };
  }
  if (parent?.filename === routerModule && name === './controllers/facturaClienteController') {
    return new Proxy({
      getAllElement: (_req, res) => res.status(200).json({ result: 'read' }),
      createElement: (_req, res) => res.status(200).json({ result: 'write' }),
    }, {
      get: (handlers, method) => handlers[method] || ((_req, res) => res.status(200).json({ result: 'stub' })),
    });
  }
  if (parent?.filename === routerModule && name === '../../utils/multer') {
    return { single: () => (_req, _res, next) => next() };
  }
  return originalLoad.call(this, name, parent, isMain);
};

let mountFacturaCliente;
let secret;
try {
  mountFacturaCliente = require(routerModule);
  secret = require('../config').autenticacion.JWT_SECRET;
} finally {
  Module._load = originalLoad;
}

const app = express();
app.use(express.json());
mountFacturaCliente(app);

function token(id, isAdmin = false, isManagement = false, expiresIn) {
  return jwt.sign({ id, isAdmin, isManagement }, secret, { algorithm: 'HS256', ...(expiresIn ? { expiresIn } : {}) });
}

test('Gestión tiene permiso independiente de Administración y valida estado actual de la cuenta', async () => {
  const path = '/api/facturaCliente/';
  assert.equal((await request(app).post(path)).status, 401);

  const buyer = await request(app).post(path).set('Authorization', `Bearer ${token('buyer-user')}`);
  assert.equal(buyer.status, 403);
  const adminOnly = await request(app).post(path)
    .set('Authorization', `Bearer ${token('administrator-user', true, false)}`);
  assert.equal(adminOnly.status, 403);
  const disabled = await request(app).post(path)
    .set('Authorization', `Bearer ${token('disabled-user', false, true)}`);
  assert.equal(disabled.status, 403);

  const manager = await request(app).post(path)
    .set('Authorization', `Bearer ${token('management-user', false, true)}`)
    .send({ code: 'DOC-1' });
  assert.equal(manager.status, 200);
  assert.equal(manager.body.result, 'write');

  const expired = await request(app).post(path)
    .set('Authorization', `Bearer ${token('management-user', false, true, -1)}`);
  assert.equal(expired.status, 401);
  const invalid = await request(app).post(path).set('Authorization', 'Bearer invalid');
  assert.equal(invalid.status, 401);
});
