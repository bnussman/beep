export const DB_URL = process.env.DB_URL ?? "postgresql://localhost:5432";

export const DB_DATABASE = process.env.DB_DATABASE ?? "beep";

export const DB_PASSWORD = process.env.DB_PASSWORD ?? "beep";

export const DB_USER = process.env.DB_USER ?? "beep";

export const DB_CA = process.env.DB_CA;

export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};
