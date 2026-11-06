const fs = require('node:fs');
const path = require('node:path');
const Joi = require('joi');

const schemaDefinition = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'client.schema.json'), 'utf8'),
);

const clientSchema = Joi.object({
  CLIENT_SLUG: Joi.string().pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).min(2).required(),
  CLIENT_NAME: Joi.string().min(1).required(),
  PUBLIC_URL: Joi.string().uri({ scheme: ['http', 'https'] }).required(),
  API_URL: Joi.string().uri({ scheme: ['http', 'https'] }).required(),
  FEATURE_MANAGEMENT: Joi.boolean()
    .truthy('true', '1', 'on')
    .falsy('false', '0', 'off')
    .default(false),
});

function loadClientConfig(environment = process.env) {
  const isProduction = environment.NODE_ENV === 'production';
  const defaults = isProduction
    ? {}
    : {
        CLIENT_SLUG: 'cliente-local',
        CLIENT_NAME: 'Cliente local',
        PUBLIC_URL: 'http://localhost:3000',
        API_URL: 'http://localhost:8088',
      };
  const { value, error } = clientSchema.validate(
    {
      ...defaults,
      CLIENT_SLUG: environment.CLIENT_SLUG || defaults.CLIENT_SLUG,
      CLIENT_NAME: environment.CLIENT_NAME || defaults.CLIENT_NAME,
      PUBLIC_URL: environment.PUBLIC_URL || defaults.PUBLIC_URL,
      API_URL: environment.API_URL || defaults.API_URL,
      FEATURE_MANAGEMENT: environment.FEATURE_MANAGEMENT,
    },
    { abortEarly: false, convert: true },
  );

  if (error) {
    const details = error.details.map((detail) => detail.message).join('; ');
    throw new Error(`Invalid client configuration: ${details}`);
  }

  return {
    slug: value.CLIENT_SLUG,
    name: value.CLIENT_NAME,
    publicUrl: value.PUBLIC_URL,
    apiUrl: value.API_URL,
    featureManagement: value.FEATURE_MANAGEMENT,
  };
}

const clientConfig = loadClientConfig();
Object.defineProperty(clientConfig, 'schema', {
  value: schemaDefinition,
  enumerable: false,
});
Object.defineProperty(clientConfig, 'loadClientConfig', {
  value: loadClientConfig,
  enumerable: false,
});

module.exports = clientConfig;
