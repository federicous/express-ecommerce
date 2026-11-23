'use strict';
// Persist the complete message at creation time; prices and recipients must not
// change while the notification waits for a retry.
function createNotification(mail, now = Date.now()) {
  const seen = new Set();
  const recipients = [];
  for (const kind of ['to', 'cc', 'bcc']) {
    const raw = mail[kind] || '';
    if (typeof raw !== 'string') throw new Error('Unsupported recipient format');
    for (const address of raw.split(',').map(x => x.trim()).filter(Boolean)) {
      if (!/^[^\s@<>]+@[^\s@<>]+$/.test(address)) throw new Error('Invalid recipient');
      const key = address.toLowerCase();
      if (!seen.has(key)) { seen.add(key); recipients.push({address, kind, status:'pending'}); }
    }
  }
  if (!recipients.length) throw new Error('Missing recipients');
  const {to, cc, bcc, ...content} = mail;
  return {status:'pending', attempts:0, nextAttemptAt:new Date(now), recipients, content};
}
function mailForRecipients(job, addresses) {
  const selected = new Set(addresses.map(x => x.toLowerCase()));
  const mail = { ...job.content };
  for (const kind of ['to', 'cc', 'bcc']) mail[kind] = job.recipients.filter(r => r.kind === kind && selected.has(r.address.toLowerCase())).map(r => r.address).join(',');
  return mail;
}
module.exports = {createNotification, mailForRecipients};
