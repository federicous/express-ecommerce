// G03: validate new/explicitly changed values, never rewrite historical documents.
function validAmount(value) {
  if (typeof value !== 'string' && (typeof value !== 'number' || !Number.isFinite(value))) return false;
  const match = String(value).trim().match(/^(\d+)(?:\.(\d{1,2}))?$/);
  return Boolean(match && BigInt(match[1]) * 100n + BigInt((match[2] || '').padEnd(2, '0')) > 0n);
}

function validDate(value) {
  if (typeof value !== 'string' || !/^\d{2}\/\d{2}\/\d{4}$/.test(value.trim())) return false;
  const [day, month, year] = value.trim().split('/').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() + 1 === month && date.getUTCDate() === day;
}

function validateDocument(input, { partial = false } = {}) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return 'invalid_payload';
  if ((!partial || Object.hasOwn(input, 'monto')) && !validAmount(input.monto)) return 'invalid_amount';
  if ((!partial || Object.hasOwn(input, 'fecha')) && !validDate(input.fecha)) return 'invalid_date';
  // Due date is optional in the existing forms. If supplied, it must be real;
  // no new rule about chronological order or fiscal periods is introduced.
  if (Object.hasOwn(input, 'vencimiento') && input.vencimiento !== '' && !validDate(input.vencimiento)) return 'invalid_date';
  return null;
}

module.exports = { validAmount, validDate, validateDocument };
