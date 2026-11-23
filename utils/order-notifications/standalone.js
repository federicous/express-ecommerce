'use strict';
// Optional separate worker for rollback: the old API may be restored without
// abandoning notifications created by the new release. The launcher must load
// the same protected runtime environment before invoking this script.
async function start() {
  if (process.env.ORDER_OUTBOX_STANDALONE !== 'true') throw new Error('ORDER_OUTBOX_STANDALONE must be explicitly enabled');
  const {mongoose} = require('../../config/mongo');
  await mongoose.connection.asPromise();
  require('./runner').start();
}
start().catch(error => { console.error(`Notification worker startup failed: ${error.message}`); process.exitCode = 1; });
