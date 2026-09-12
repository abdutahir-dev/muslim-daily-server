import dotenv from 'dotenv';

dotenv.config();

const DEFAULT_INSECURE_JWT = 'your_super_secret_key_change_this_in_production';

const toInt = (value, fallback) => {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toBool = (value, fallback = false) => {
  if (value === undefined || value === null || value === '') return fallback;
  return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase());
};

const toList = (value) => {
  if (!value) return [];
  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';

const resolveJwtSecret = () => {
  const secret = String(process.env.JWT_SECRET || '').trim();

  if (!secret) {
    if (isProduction) {
      throw new Error('Missing required env var JWT_SECRET in production.');
    }

    console.warn('[config] JWT_SECRET missing. Falling back to a dev-only insecure secret.');
    return 'dev-only-insecure-secret';
  }

  if (isProduction && secret === DEFAULT_INSECURE_JWT) {
    throw new Error('JWT_SECRET uses insecure default value in production.');
  }

  return secret;
};

const configuredOrigins = toList(process.env.CORS_ORIGINS);
const fallbackOrigins = ['https://muslim-daily.web.et', 'https://app.muslim-daily.web.et'];
const corsOrigins = [...new Set([...configuredOrigins, ...fallbackOrigins])];
const allowAnyOrigin = true;//!isProduction && corsOrigins.length === 0;

export const appConfig = {
  nodeEnv,
  isProduction,
  host: process.env.IP_ADDRESS || '0.0.0.0',
  port: toInt(process.env.PORT, 5003),
  httpsPort: toInt(process.env.S_PORT, 5004),
  certPath: process.env.CERT || './certs/certificate.crt',
  keyPath: process.env.KEY || './certs/private.key',
  enableHttpsInDev: toBool(process.env.ENABLE_HTTPS_IN_DEV, true),
  trustProxy: toBool(process.env.TRUST_PROXY, isProduction),
  jwtSecret: resolveJwtSecret(),
  corsOrigins,
  allowAnyOrigin,
  bodyLimit: process.env.BODY_LIMIT || '10mb',
  rateLimitWindowMs: toInt(process.env.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
  rateLimitMaxRequests: toInt(process.env.RATE_LIMIT_MAX_REQUESTS, 1000),
};
