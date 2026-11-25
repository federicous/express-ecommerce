const assert = require('node:assert/strict');
const test = require('node:test');
process.env.NODE_ENV = 'test';

const bcrypt = require('bcryptjs');
const express = require('express');
const jwt = require('jsonwebtoken');
const request = require('supertest');
const users = require('../schema/usuarios');
const auth = require('../middleware/autenticacion');
const session = require('../routes/session');
// The controller imports unrelated legacy DB services for other routes.
const mongoose = require('mongoose');
const noConnection = test.mock.method(mongoose, 'connect', async () => mongoose);
const login = require('../components/auth/controllers/authController').postLogin;
noConnection.mock.restore();
const { JWT_SECRET } = require('../config').autenticacion;

const app = express();
app.use(express.json());
app.post('/login', login);
app.get('/api/auth/session', auth.usuario, session);
app.get('/admin', auth.administrador, (_req, res) => res.sendStatus(204));
app.get('/management', auth.gestion, (_req, res) => res.sendStatus(204));

test('buyer receives an 8-hour browser session; privileged accounts receive one hour', async t => {
  const password = 'session-test-password';
  const email = 'synthetic@example.test';
  let user;
  t.mock.method(users, 'findOne', async () => user);
  t.mock.method(users, 'findById', () => ({ select: () => ({ lean: async () => user }) }));

  for (const [isAdmin, isManagement, seconds] of [['off', 'off', 28800], [true, 'off', 3600], ['off', 'on', 3600]]) {
    user = { _id: 'synthetic', email, enable: 'on', isAdmin, isManagement, password: bcrypt.hashSync(password, 4) };
    const result = await request(app).post('/login').send({ email, password });
    assert.equal(result.status, 200);
    assert.equal(result.headers['cache-control'], 'no-store');
    assert.equal(result.body.sessionMaxAgeSeconds, seconds);
    const cookies = result.headers['set-cookie'];
    assert.equal(cookies.length, 3);
    for (const cookie of cookies) {
      assert.match(cookie, new RegExp(`(?:^|; )Max-Age=${seconds}(?:;|$)`));
      assert.match(cookie, /; SameSite=Lax/);
    }
    const token = result.body.token;
    const { iat, exp, storefrontOnly } = jwt.verify(token, JWT_SECRET);
    assert.equal(exp - iat, seconds);
    assert.doesNotThrow(() => jwt.verify(token, JWT_SECRET, { clockTimestamp: exp - 1 }));
    assert.throws(() => jwt.verify(token, JWT_SECRET, { clockTimestamp: exp }), { name: 'TokenExpiredError' });
    const get = path => request(app).get(path).set('Authorization', `Bearer ${token}`);
    if (seconds === 28800) {
      assert.equal(storefrontOnly, true);
      assert.doesNotThrow(() => jwt.verify(token, JWT_SECRET, { clockTimestamp: iat + 3601 }));
      user = { ...user, isAdmin: 'on', isManagement: 'on' };
      const check = await get('/api/auth/session');
      assert.equal(check.status, 200);
      assert.equal(check.body.user.isAdmin, false);
      assert.equal(check.body.user.isManagement, false);
      assert.equal((await get('/admin')).status, 403);
      assert.equal((await get('/management')).status, 403);
    } else {
      assert.equal(storefrontOnly, undefined);
      assert.equal((await get(isAdmin === true ? '/admin' : '/management')).status, 204);
    }
  }
});
