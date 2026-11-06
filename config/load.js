const { loadSharedCookieScope } = require('../utils/sharedCookieScope');
const MongoStore = require('connect-mongo');
const Joi = require('joi');

const { loadClientConfig } = require('./client');
const { loadManagementOptions } = require('./managementOptions');

const LOCAL_MONGO_URI = 'mongodb://127.0.0.1:27017/b2b_local_db';
const LOCAL_SESSION_SECRET = 'local-only-session-secret-change-me-32';
const LOCAL_JWT_SECRET = 'local-only-jwt-secret-change-me-32';
const LOCAL_CORS_ORIGINS = 'http://localhost:3000,http://localhost:3001,http://localhost:3002';
const DEFAULT_LIST_IMPORT_MAX_MB = 20;

const environmentSchema = Joi.object({
  HOST: Joi.alternatives()
    .try(
      Joi.string().ip({ version: ['ipv4', 'ipv6'], cidr: 'forbidden' }),
      Joi.string().hostname(),
    )
    .required(),
  PORT: Joi.number().integer().min(1).max(65535).default(18089),
  MONGO_URI: Joi.string().uri({ scheme: ['mongodb', 'mongodb+srv'] }).required(),
  SESSION_SECRET: Joi.string().min(32).required(),
  JWT_SECRET: Joi.string().min(32).required(),
  CORS_ORIGINS: Joi.string().min(1).required(),
  COOKIE_AGE: Joi.number().integer().min(1).default(1000 * 60 * 60 * 24),
  JWT_ALG: Joi.string().valid('HS256', 'HS384', 'HS512').default('HS256'),
  JWT_EXP: Joi.string().default('1d'),
  LIST_IMPORT_MAX_MB: Joi.number().integer().min(1).max(100).default(DEFAULT_LIST_IMPORT_MAX_MB),
}).unknown(true);

function validateEnvironment(environment, isProduction) {
  const source = {
    ...environment,
    HOST: environment.HOST || (isProduction ? '127.0.0.1' : '0.0.0.0'),
    MONGO_URI: environment.MONGO_URI || (!isProduction ? LOCAL_MONGO_URI : undefined),
    SESSION_SECRET:
      environment.SESSION_SECRET || (!isProduction ? LOCAL_SESSION_SECRET : undefined),
    JWT_SECRET: environment.JWT_SECRET || (!isProduction ? LOCAL_JWT_SECRET : undefined),
    CORS_ORIGINS:
      environment.CORS_ORIGINS || (!isProduction ? LOCAL_CORS_ORIGINS : undefined),
  };

  const { value, error } = environmentSchema.validate(source, {
    abortEarly: false,
    convert: true,
  });
  if (error) {
    const details = error.details.map((detail) => detail.message).join('; ');
    throw new Error(`Invalid server configuration: ${details}`);
  }
  if (isProduction && value.CORS_ORIGINS.split(',').some((origin) => origin.trim() === '*')) {
    throw new Error('Invalid server configuration: CORS_ORIGINS cannot contain * in production');
  }

  return value;
}

function createSessionConfig(environment, options) {
  const sessionConfig = {
    secret: environment.SESSION_SECRET,
    cookie: {
      maxAge: environment.COOKIE_AGE,
      httpOnly: true,
      secure: options.isProduction,
      sameSite: 'lax',
    },
    resave: false,
    saveUninitialized: false,
  };

  if (options.createSessionStore) {
    sessionConfig.store = MongoStore.create({
      mongoUrl: environment.MONGO_URI,
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    });
  }

  return sessionConfig;
}

function loadConfig(environment = process.env, options = {}) {
  loadSharedCookieScope(environment);
  const isProduction = environment.NODE_ENV === 'production';
  const validated = validateEnvironment(environment, isProduction);
  const client = loadClientConfig(environment);
  const managementOptions = loadManagementOptions(environment);
  const createSessionStore = options.createSessionStore !== false;

  return {
    config: {
      HOST: validated.HOST,
      PORT: validated.PORT,
      MONGO_URI: validated.MONGO_URI,
      MONGO_ATLAS: validated.MONGO_URI,
      DB: 'mongo',
      SESSION: createSessionConfig(validated, { createSessionStore, isProduction }),
      CORS: validated.CORS_ORIGINS.split(',').map((origin) => origin.trim()),
      LIST_IMPORT_MAX_BYTES: validated.LIST_IMPORT_MAX_MB * 1024 * 1024,
    },
    correo: {
      NODEMAILER_USER: environment.NODEMAILER_USER,
      NODEMAILER_PASS: environment.NODEMAILER_PASS,
      NODEMAILER_HOST: environment.NODEMAILER_HOST,
      NODEMAILER_PORT: environment.NODEMAILER_PORT,
      NODEMAILER_ADMIN: environment.NODEMAILER_ADMIN,
      NODEMAILER_BCC: environment.NODEMAILER_BCC,
      NODEMAILER_FROM: environment.NODEMAILER_FROM || environment.NODEMAILER_USER,
      ORDER_CONTACT_EMAIL:
        environment.ORDER_CONTACT_EMAIL || environment.NODEMAILER_FROM || environment.NODEMAILER_USER,
      NODEMAILER_SECURE: environment.NODEMAILER_SECURE === 'true',
      NODEMAILER_REQUIRE_TLS: environment.NODEMAILER_REQUIRE_TLS !== 'false',
    },
    autenticacion: {
      JWT_SECRET: validated.JWT_SECRET,
      JWT_ALG: validated.JWT_ALG,
      JWT_EXP: validated.JWT_EXP,
    },
    client,
    managementOptions,
  };
}

module.exports = { loadConfig };
