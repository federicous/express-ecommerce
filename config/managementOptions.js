// Instance-specific names, not a shared catalog or a migration of historical data.
function readList(environment, key) {
  if (environment[key] === undefined) return [];
  let values;
  try { values = JSON.parse(environment[key]); } catch (_) {
    throw new Error(`Invalid management configuration: ${key} must be a JSON array`);
  }
  if (!Array.isArray(values) || values.some((value) => typeof value !== 'string' || !value.trim())) {
    throw new Error(`Invalid management configuration: ${key} must contain non-empty strings`);
  }
  const normalized = values.map((value) => value.trim());
  if (new Set(normalized).size !== normalized.length) {
    throw new Error(`Invalid management configuration: ${key} contains duplicate names`);
  }
  return normalized;
}

function loadManagementOptions(environment = process.env) {
  return {
    suppliers: readList(environment, 'MANAGEMENT_SUPPLIERS_JSON'),
    sellers: readList(environment, 'MANAGEMENT_SELLERS_JSON'),
  };
}

module.exports = { loadManagementOptions };
