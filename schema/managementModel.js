const mongoose = require('mongoose');

// Joi.string().required() era interpretado por Mongoose como Mixed. Este mínimo
// no decide reglas comerciales: fija tipos y el código exigido por los formularios.
function managementModel(modelName, fieldNames) {
  if (!fieldNames.includes('code')) {
    throw new Error(`El modelo de gestión ${modelName} debe declarar code`);
  }

  const definition = Object.fromEntries(fieldNames.map((field) => [
    field,
    field === 'timestamp' ? Number : String,
  ]));
  definition.code = { type: String, trim: true, required: true };

  return mongoose.model(modelName, new mongoose.Schema(definition));
}

module.exports = managementModel;
