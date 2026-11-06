// TLS terminates at the controlled BRMTools Apache proxy.
const Server = require('./server/server');
module.exports = new Server().init();
