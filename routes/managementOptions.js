const { loadManagementOptions } = require('../config/managementOptions');

function createManagementOptionsHandler(environment = process.env) {
  const options = loadManagementOptions(environment);
  return (_req, res) => res.set('Cache-Control', 'no-store').json(options);
}

module.exports = { createManagementOptionsHandler };
