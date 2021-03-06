export const isProduction = process.env.NODE_ENV === "production";

export const ENVIRONMENT: 'staging' | 'production' | 'development' = process.env.ENVIRONMENT_NAME as 'staging' | 'production' ?? "development";

export const isDevelopment = ENVIRONMENT !== "production" && ENVIRONMENT !== "staging";

export const GOOGLE_API_KEYS = process.env.GOOGLE_API_KEYS;

export const SENTRY_URL = process.env.SENTRY_URL;

export const DB_URL = process.env.DB_URL || "postgresql://localhost:5432";

export const DB_DATABASE = process.env.DB_DATABASE || "beep";

export const DB_PASSWORD = process.env.DB_PASSWORD || "beep";

export const DB_USER = process.env.DB_USER || "beep";

export const DB_CA = process.env.DB_CA;

export const REDIS_HOST = process.env.REDIS_HOST || "localhost";

export const REDIS_PASSWROD = process.env.REDIS_PASSWORD;

export const S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID;

export const S3_ACCESS_KEY_SECRET = process.env.S3_ACCESS_KEY_SECRET;

export const S3_ENDPOINT_URL = process.env.S3_ENDPOINT_URL;

export const MAIL_HOST = process.env.MAIL_HOST;

export const MAIL_PORT = process.env.MAIL_PORT;

export const MAIL_USER = process.env.MAIL_USER;

export const MAIL_PASSWORD = process.env.MAIL_PASSWORD;