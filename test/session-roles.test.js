const assert = require('node:assert/strict');
const test = require('node:test');
const { createSessionHandler } = require('../routes/session');

function response() {
  return { statusCode: null, headers: {}, body: null,
    set(name, value) { this.headers[name] = value; return this; },
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
  };
}

test('session reports current independent roles and never exposes password', async () => {
  const handler = createSessionHandler(async () => ({
    _id: 'user-1', name: 'Operator', email: 'operator@example.test', password: 'private',
    enable: 'on', isAdmin: 'off', isManagement: 'on',
  }));
  const res = response();
  await handler({ user: { id: 'user-1' } }, res);
  assert.equal(res.statusCode, 200);
  assert.equal(res.headers['Cache-Control'], 'no-store');
  assert.deepEqual(res.body.user, {
    id: 'user-1', name: 'Operator', email: 'operator@example.test', isAdmin: false,
    isManagement: true, vendedor: undefined, descuento: undefined, categoriaCliente: 'mayorista',
  });
  assert.equal(JSON.stringify(res.body).includes('private'), false);
});

test('session denies disabled or missing account and rejects absent authentication', async () => {
  for (const user of [null, { enable: 'off' }]) {
    const res = response();
    await createSessionHandler(async () => user)({ user: { id: 'user-1' } }, res);
    assert.equal(res.statusCode, 401);
    assert.deepEqual(res.body, { authenticated: false });
  }
  const unauthenticated = response();
  await createSessionHandler(async () => null)({}, unauthenticated);
  assert.equal(unauthenticated.statusCode, 401);
});
