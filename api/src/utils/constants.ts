export const isProduction = process.env.NODE_ENV === "production";

export const DB_URL = process.env.POSTGRESQL_URL || "postgresql://localhost:5432";

export const DB_DATABASE = process.env.POSTGRESQL_DATABASE || "beep";

export const DB_PASSWORD = process.env.POSTGRESQL_PASSWORD || "beep";

export const DB_USER = process.env.POSTGRESQL_USER || "beep";

export const REDIS_HOST = process.env.REDIS_HOST || "localhost";

export const REDIS_PASSWROD = process.env.REDIS_PASSWORD;