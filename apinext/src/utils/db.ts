import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { DB_CA, DB_URL } from "./constants";
import * as  schema from '../../drizzle/schema';

const queryClient = postgres(DB_URL,
  DB_CA ? {
    ssl: {
      ca: DB_CA
    }
  } : undefined,
);

export const db = drizzle(queryClient, { schema, logger: true });
