'use strict';
const { classifyFailure, classifyResponse } = require('./notification-policy');

// store.claimDue must atomically claim one pending notification and mark it
// in-flight before returning. A lost claim is REVIEW, never auto-resend.
async function processOne(store, send, now = Date.now()) {
  const job = await store.claimDue(new Date(now));
  if (!job) return false;
  const recipients = job.recipients.filter(r => r.status === 'pending').map(r => r.address);
  if (!recipients.length) {
    await store.finish(job, { status: 'review', lastError: 'No pending recipients' });
    return true;
  }
  let result;
  try {
    result = await send(job, recipients);
  } catch (error) {
    await store.finish(job, classifyFailure(error, job.attempts, now));
    return true;
  }
  {
    const outcomes = classifyResponse(result, recipients);
    // Partial or unclear outcomes need review; do not resend accepted addresses.
    const byAddress = new Map(outcomes.map(r => [r.address.toLowerCase(), r.status]));
    const updatedRecipients = job.recipients.map(r => ({ ...r, status: byAddress.get(r.address.toLowerCase()) || r.status }));
    await store.finish(job, { status: updatedRecipients.every(r => r.status === 'accepted') ? 'accepted' : 'review', recipients: updatedRecipients, messageId: result.messageId || null });
  }
  return true;
}
module.exports = { processOne };
