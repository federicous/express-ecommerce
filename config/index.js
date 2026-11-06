const path = require('node:path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const { loadConfig } = require('./load');

module.exports = {
  // Las pruebas HTTP levantan la app sin infraestructura externa. En
  // desarrollo y producción se mantiene MongoStore como hasta ahora.
  ...loadConfig(process.env, { createSessionStore: process.env.NODE_ENV !== 'test' }),
  loadConfig,
};
