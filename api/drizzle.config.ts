import { defineConfig } from 'drizzle-kit';
import { DB_DATABASE, DB_PASSWORD, DB_URL, DB_USER } from './src/utils/constants';

export default defineConfig({
  schema: "./db/schema.ts",
  dialect: 'postgresql',
  dbCredentials: {
    host: 'localhost',
    port: 5432,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    ssl: false,
  },
});