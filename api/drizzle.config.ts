import type { Config } from "drizzle-kit";
import { DB_DATABASE, DB_PASSWORD, DB_USER } from './src/utils/constants';

export default {
  schema: './drizzle/schema.ts',
  out: "./drizzle",
  driver: 'pg',
  dbCredentials: {
    user: DB_USER,
    password: DB_PASSWORD,
    host: "localhost",
    database: DB_DATABASE,
  }
} satisfies Config;
