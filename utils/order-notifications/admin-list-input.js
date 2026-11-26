'use strict';

const ALLOWED_TYPES = new Set(['order', 'quote']);
const ALLOWED_NOTIFICATION_STATUSES = new Set(['pending', 'sending', 'accepted', 'review', 'unavailable']);

// Keep input parsing separate from database execution and reject broad or
// ambiguous values rather than interpolating them into MongoDB expressions.
function parseAdminListInput(query = {}) {
  const scalar = key => {
    const value = query[key];
    if (value === undefined || value === '') return '';
    if (typeof value !== 'string') throw new Error('invalid_' + key);
    return value.trim();
  };
  const id = scalar('id'), email = scalar('email'), from = scalar('from'), to = scalar('to'), before = scalar('before');
  const type = scalar('type'), notificationStatus = scalar('notificationStatus');
  const limitText = scalar('limit');
  if (id && !/^[0-9a-f]{24}$/i.test(id)) throw new Error('invalid_id');
  if (before && !/^[0-9a-f]{24}$/i.test(before)) throw new Error('invalid_before');
  if (email.length > 254 || /[\x00-\x1f]/.test(email)) throw new Error('invalid_email');
  if (type && !ALLOWED_TYPES.has(type)) throw new Error('invalid_type');
  if (notificationStatus && !ALLOWED_NOTIFICATION_STATUSES.has(notificationStatus)) {
    throw new Error('invalid_notificationStatus');
  }
  const validDate = value => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value + 'T00:00:00Z')) && new Date(value + 'T00:00:00Z').toISOString().slice(0, 10) === value;
  if ((from && !validDate(from)) || (to && !validDate(to)) || (from && to && from > to)) throw new Error('invalid_date');
  if (limitText && !/^(?:[1-9]|[1-9]\d|100)$/.test(limitText)) throw new Error('invalid_limit');
  return { id, email, from, to, before, type, notificationStatus, limit: limitText ? Number(limitText) : 50 };
}
module.exports = { parseAdminListInput, ALLOWED_TYPES, ALLOWED_NOTIFICATION_STATUSES };
