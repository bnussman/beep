import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { DB_CA, DB_DATABASE, DB_PASSWORD, DB_URL, DB_USER } from "./constants";
import * as  schema from '../../drizzle/schema';

const queryClient = postgres(DB_URL, {
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  ...(!!DB_CA && {
    ssl: {
      ca: DB_CA
    }
  }),
});

export const db = drizzle(queryClient, { schema, logger: true });
