export const DB_URL = process.env.DB_URL ?? "postgresql://localhost:5432";

export const DB_DATABASE = process.env.DB_DATABASE ?? "beep";

export const DB_PASSWORD = process.env.DB_PASSWORD ?? "beep";

export const DB_USER = process.env.DB_USER ?? "beep";

export const DB_CA = process.env.DB_CA;

export const REDIS_HOST = process.env.REDIS_HOST || "localhost";

export const REDIS_PASSWROD = process.env.REDIS_PASSWORD;
