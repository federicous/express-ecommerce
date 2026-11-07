const assert = require('node:assert/strict');
const test = require('node:test');
const express = require('express');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const { loadManagementOptions } = require('../config/managementOptions');
const { loadConfig } = require('../config/load');
const { createManagementOptionsHandler } = require('../routes/managementOptions');

process.env.NODE_ENV = 'test';
const UsuarioModel = require('../schema/usuarios');
const managementUsers = new Map([
  ['operator-a', { enable: 'on', isManagement: 'on' }],
  ['synthetic', { enable: 'on', isManagement: 'on' }],
  ['administrator', { enable: 'on', isAdmin: 'on', isManagement: 'off' }],
]);
UsuarioModel.findById = id => ({ select: () => ({ lean: async () => managementUsers.get(String(id)) || null }) });
const auth = require('../middleware/autenticacion');
const secret = require('../config').autenticacion.JWT_SECRET;

test('management catalogs default empty, normalize names and remain instance-local', () => {
  assert.deepEqual(loadManagementOptions({}), { suppliers: [], sellers: [] });
  const a = { MANAGEMENT_SUPPLIERS_JSON: '[" Proveedor A "]', MANAGEMENT_SELLERS_JSON: '["Vendedor A"]' };
  const b = { MANAGEMENT_SUPPLIERS_JSON: '["Proveedor B"]' };
  assert.deepEqual(loadConfig(a, { createSessionStore: false }).managementOptions, {
    suppliers: ['Proveedor A'], sellers: ['Vendedor A'],
  });
  assert.deepEqual(loadManagementOptions(b), { suppliers: ['Proveedor B'], sellers: [] });
});

test('invalid catalog configuration fails closed without exposing its contents', () => {
  for (const value of ['', 'not-json', '{}', 'null', '[null]', '[1]', '[" "]', '["A", " A "]']) {
    assert.throws(() => loadConfig({ MANAGEMENT_SELLERS_JSON: value }, { createSessionStore: false }),
      /Invalid management configuration: MANAGEMENT_SELLERS_JSON/);
  }
});

test('options endpoint requires management permission and publishes only catalog names with no cache', async () => {
  const app = express();
  app.get('/api/management/options', auth.gestion, createManagementOptionsHandler({
    MANAGEMENT_SUPPLIERS_JSON: '["Proveedor local"]', MANAGEMENT_SELLERS_JSON: '["Vendedor local"]',
    JWT_SECRET: 'do-not-publish', MONGO_URI: 'do-not-publish',
  }));
  assert.equal((await request(app).get('/api/management/options')).status, 401);
  for (const [id, isAdmin, isManagement, expiresIn, status] of [['administrator', true, false, '1h', 403], ['synthetic', false, true, -1, 401], ['synthetic', false, true, '1h', 200]]) {
    const token = jwt.sign({ id, isAdmin, isManagement }, secret, { expiresIn });
    const response = await request(app).get('/api/management/options').set('Authorization', `Bearer ${token}`);
    assert.equal(response.status, status);
    if (status === 200) {
      assert.equal(response.headers['cache-control'], 'no-store');
      assert.deepEqual(response.body, { suppliers: ['Proveedor local'], sellers: ['Vendedor local'] });
    }
  }
});

test('two handlers do not share catalogs or change when source environment changes', async () => {
  const env = { MANAGEMENT_SUPPLIERS_JSON: '["Instancia A"]' };
  const app = express();
  app.get('/a', createManagementOptionsHandler(env));
  app.get('/b', createManagementOptionsHandler({ MANAGEMENT_SUPPLIERS_JSON: '["Instancia B"]' }));
  env.MANAGEMENT_SUPPLIERS_JSON = '["Changed"]';
  assert.deepEqual((await request(app).get('/a')).body.suppliers, ['Instancia A']);
  assert.deepEqual((await request(app).get('/b')).body.suppliers, ['Instancia B']);
});
