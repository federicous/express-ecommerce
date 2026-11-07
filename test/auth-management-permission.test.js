const assert = require('node:assert/strict');
const test = require('node:test');
process.env.NODE_ENV = 'test';
const bcrypt = require('bcryptjs');
const UsuarioModel = require('../schema/usuarios');
const AuthService = require('../components/auth/services/mongo');
const JWT = require('../utils/jwt/jwt');

let storedUser;
let loginUser;
const originalFindOne = UsuarioModel.findOne;
const originalSave = UsuarioModel.prototype.save;
UsuarioModel.findOne = async () => loginUser || null;
UsuarioModel.prototype.save = async function saveSyntheticUser() {
  storedUser = this.toObject();
  return this;
};
test.after(() => {
  UsuarioModel.findOne = originalFindOne;
  UsuarioModel.prototype.save = originalSave;
});

test('public registration cannot self-grant administrator or management permission', async () => {
  storedUser = null;
  const service = new AuthService();
  await service.createUser({ email: 'new@example.test', password: 'Secret123', isAdmin: 'on', isManagement: 'on', enable: 'on' }, null);
  assert.equal(storedUser.isAdmin, 'off');
  assert.equal(storedUser.enable, 'off');
  assert.equal(Object.hasOwn(storedUser, 'isManagement'), false);
});

test('login token carries the explicit management role while admin stays independent', async () => {
  loginUser = {
    _id: 'synthetic-user', name: 'Manager', email: 'manager@example.test',
    password: bcrypt.hashSync('Secret123', 4), enable: 'on', isAdmin: 'off', isManagement: 'on',
  };
  const service = new AuthService();
  const response = await service.login(loginUser.email, 'Secret123');
  const claims = await JWT.verify(response.token);
  assert.equal(claims.isAdmin, 'off');
  assert.equal(claims.isManagement, 'on');
});
