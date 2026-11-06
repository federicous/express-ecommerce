const assert = require('node:assert/strict');
const Module = require('node:module');
const test = require('node:test');
const express = require('express');
const jwt = require('jsonwebtoken');
const request = require('supertest');

process.env.NODE_ENV = 'test';

const routerModule = require.resolve('../components/facturaCliente');
const originalLoad = Module._load;
Module._load = function stubPersistence(name, parent, isMain) {
  if (name.includes('utils/logger/pino')) {
    return { info() {}, error() {}, warn() {}, debug() {} };
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

function token(isAdmin) {
  return jwt.sign({ id: 'synthetic-user', isAdmin }, secret, { algorithm: 'HS256' });
}

test('management mutations distinguish missing token, insufficient role and administrator', async () => {
  const path = '/api/facturaCliente/';
  const anonymous = await request(app).post(path);
  assert.equal(anonymous.status, 401);

  const normalToken = token(false);
  const reader = await request(app).get(path).set('Authorization', `Bearer ${normalToken}`);
  assert.equal(reader.status, 403);
  const forbidden = await request(app).post(path).set('Authorization', `Bearer ${normalToken}`);
  assert.equal(forbidden.status, 403);

  const administrator = await request(app).post(path)
    .set('Authorization', `Bearer ${token(true)}`)
    .send({ code: 'DOC-1' });
  assert.equal(administrator.status, 200);
  assert.equal(administrator.body.result, 'write');

  const invalid = await request(app).post(path).set('Authorization', 'Bearer invalid');
  assert.equal(invalid.status, 401);
});
