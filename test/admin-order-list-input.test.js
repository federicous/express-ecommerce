'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { parseAdminListInput } = require('../utils/order-notifications/admin-list-input');

test('accepts bounded filters including type and notificationStatus and defaults to 50 results', () => {
  assert.deepEqual(
    parseAdminListInput({
      email: ' test@example.com ',
      from: '2026-11-16',
      to: '2026-11-25',
      type: 'quote',
      notificationStatus: 'review',
    }),
    {
      id: '',
      email: 'test@example.com',
      from: '2026-11-16',
      to: '2026-11-25',
      before: '',
      type: 'quote',
      notificationStatus: 'review',
      limit: 50,
    }
  );
});

test('rejects injection, invalid dates, cursors, types, statuses and limits', () => {
  for (const input of [
    { email: { $ne: '' } },
    { id: 'invalid' },
    { before: 'invalid' },
    { from: '2026-02-30' },
    { from: '2026-11-25', to: '2026-11-16' },
    { type: 'invalid' },
    { type: { $ne: '' } },
    { notificationStatus: 'unknown' },
    { notificationStatus: { $in: ['accepted'] } },
    { limit: '101' },
    { limit: '0' },
  ]) {
    assert.throws(() => parseAdminListInput(input));
  }
});
