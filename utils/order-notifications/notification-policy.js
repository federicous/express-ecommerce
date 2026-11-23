'use strict';

// Only an explicit SMTP transient rejection is safe to retry automatically.
// Network errors may occur after the server accepted DATA, so require review.
const MAX_ATTEMPTS = 6;
function classifyFailure(error, attempts, now = Date.now()) {
  const code = Number(error && error.responseCode);
  const message = String(error && (error.response || error.message) || 'Unknown SMTP error').slice(0, 500);
  if (code >= 400 && code < 500 && error && error.command === 'DATA' && attempts < MAX_ATTEMPTS) {
    const delay = Math.min(60 * 60 * 1000, 60 * 1000 * (2 ** Math.max(0, attempts - 1)));
    return { status: 'pending', nextAttemptAt: new Date(now + delay), lastError: message };
  }
  return { status: 'review', nextAttemptAt: null, lastError: message };
}
function classifyResponse(result, attempted) {
  const normalize = values => new Set((values || []).map(value => String(value).toLowerCase()));
  const accepted = normalize(result && result.accepted);
  const rejected = normalize(result && result.rejected);
  return attempted.map(address => ({ address, status: accepted.has(address.toLowerCase()) ? 'accepted' : rejected.has(address.toLowerCase()) ? 'rejected' : 'unknown' }));
}
module.exports = { classifyFailure, classifyResponse, MAX_ATTEMPTS };
