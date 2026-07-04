const {
  VITE_APP_NAME,
  VITE_ENV,
  VITE_API_BASE_URL,
  VITE_RAZORPAY_KEY_ID,
  VITE_ENABLE_LOGS,
} = import.meta.env;

const requiredVariables = {
  VITE_APP_NAME,
  VITE_ENV,
  VITE_API_BASE_URL,
  VITE_RAZORPAY_KEY_ID,
  VITE_ENABLE_LOGS,
};

const missingVariables = Object.entries(requiredVariables)
  .filter(([, value]) => value === undefined || value === null || String(value).trim() === '')
  .map(([name]) => name);

if (missingVariables.length > 0) {
  throw new Error(
    `Missing required environment variable${missingVariables.length > 1 ? 's' : ''}: ${missingVariables.join(', ')}`,
  );
}

const supportedEnvironments = ['dev', 'nonprod', 'prod'];

if (!supportedEnvironments.includes(VITE_ENV)) {
  throw new Error(
    `Invalid VITE_ENV "${VITE_ENV}". Expected one of: ${supportedEnvironments.join(', ')}.`,
  );
}

if (!['true', 'false'].includes(VITE_ENABLE_LOGS.toLowerCase())) {
  throw new Error('Invalid VITE_ENABLE_LOGS. Expected "true" or "false".');
}

const env = Object.freeze({
  appName: VITE_APP_NAME,
  environment: VITE_ENV,
  apiBaseUrl: VITE_API_BASE_URL,
  razorpayKeyId: VITE_RAZORPAY_KEY_ID,
  enableLogs: VITE_ENABLE_LOGS.toLowerCase() === 'true',
});

export const isDev = env.environment === 'dev';
export const isNonProd = env.environment === 'nonprod';
export const isProd = env.environment === 'prod';

export default env;
