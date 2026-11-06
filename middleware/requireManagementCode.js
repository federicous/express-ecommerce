const fs = require('node:fs/promises');

async function requireManagementCode(req, res, next) {
  const code = req.body?.code;
  if (typeof code !== 'string' || !code.trim()) {
    if (req.file?.path) {
      try {
        await fs.unlink(req.file.path);
      } catch (error) {
        return next(error);
      }
    }
    return res.status(400).json({
      error: 'validation_error',
      details: [{ field: 'code', message: 'El código es obligatorio' }],
    });
  }
  req.body.code = code.trim();
  return next();
}

module.exports = requireManagementCode;
