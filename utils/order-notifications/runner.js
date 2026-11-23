'use strict';
const Order = require('../../schema/ordenes');
const transport = require('../nodemailer/transport');
const log = require('../logger/pino');
const {createStore} = require('./notification-store');
const {processOne} = require('./notification-worker');
const {mailForRecipients} = require('./create-notification');
const store = createStore(Order);
let running = false;
async function tick() {
  if (running) return;
  running = true;
  try {
    // Jobs interrupted after submission have an ambiguous outcome: review only.
    await store.recoverStale(new Date(Date.now() - 30 * 60 * 1000));
    await processOne(store, (job, recipients) => transport.sendMail(mailForRecipients(job, recipients)));
  } catch (error) { log.error(`Notification worker: ${error}`); }
  finally { running = false; }
}
function start() { tick(); return setInterval(tick, 30000); }
module.exports = {start, tick};
