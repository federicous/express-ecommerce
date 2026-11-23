// TLS terminates at the controlled BRMTools Apache proxy.
const Server = require('./server/server');
module.exports = new Server().init();

// Explicitly enable after verifying the idempotency index and SMTP transport.
if (process.env.ORDER_OUTBOX_ENABLED === 'true') {
  require('./utils/order-notifications/runner').start();
}
