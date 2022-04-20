export const isProduction = process.env.NODE_ENV === "production";

export const ENVRIONMENT: 'staging' | 'production' | 'development' = process.env.GITLAB_ENVIRONMENT_NAME as 'staging' | 'production' ?? "development";

export const DB_URL = process.env.POSTGRESQL_URL || "postgresql://localhost:5432";

export const DB_DATABASE = process.env.POSTGRESQL_DATABASE || "beep";

export const DB_PASSWORD = process.env.POSTGRESQL_PASSWORD || "beep";

export const DB_USER = process.env.POSTGRESQL_USER || "beep";

export const REDIS_HOST = process.env.REDIS_HOST || "localhost";

export const REDIS_PASSWROD = process.env.REDIS_PASSWORD;

export const S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID;

export const S3_ACCESS_KEY_SECRET = process.env.S3_ACCESS_KEY_SECRET;

export const S3_ENDPOINT_URL = process.env.S3_ENDPOINT_URL;