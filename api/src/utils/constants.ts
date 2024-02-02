export const GOOGLE_API_KEYS = process.env.GOOGLE_API_KEYS;

export const SENTRY_URL = process.env.SENTRY_URL;

export const DB_URL = process.env.DB_URL || "mysql://localhost:3306";

export const DB_DATABASE = process.env.DB_DATABASE || "beep";

export const DB_PASSWORD = process.env.DB_PASSWORD || "beep";

export const DB_USER = process.env.DB_USER || "beep";

export const DB_CA = process.env.DB_CA;

export const REDIS_HOST = process.env.REDIS_HOST || "localhost";

export const REDIS_PASSWROD = process.env.REDIS_PASSWORD;

export const S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID ?? "beep";

export const S3_ACCESS_KEY_SECRET = process.env.S3_ACCESS_KEY_SECRET ?? "beepbeepbeep";

export const S3_ENDPOINT_URL = process.env.S3_ENDPOINT_URL ?? "http://localhost:9000";

export const isLocalS3 = S3_ACCESS_KEY_SECRET === "beepbeepbeep";

export const S3_BUCKET_URL = isLocalS3 ? "http://localhost:9000/beep/" : "https://beep.us-east-1.linodeobjects.com/";

export const MAIL_HOST = process.env.MAIL_HOST;

export const MAIL_PORT = process.env.MAIL_PORT;

export const MAIL_USER = process.env.MAIL_USER;

export const MAIL_PASSWORD = process.env.MAIL_PASSWORD;

export const REVENUE_CAT_WEBHOOK_TOKEN = process.env.REVENUE_CAT_WEBHOOK_TOKEN;

export const REVENUE_CAT_SECRET = process.env.REVENUE_CAT_SECRET;

export const isProduction = process.env.NODE_ENV === "production";

export const ENVIRONMENT: 'staging' | 'production' | 'development' = process.env.ENVIRONMENT_NAME as 'staging' | 'production' ?? "development";

export const isDevelopment = ENVIRONMENT !== "production" && ENVIRONMENT !== "staging" && DB_PASSWORD === 'beep';
