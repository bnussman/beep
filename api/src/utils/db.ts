import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { DB_CA, DB_HOST, DB_URL, ENVIRONMENT } from "./constants";
import * as  schema from '../../drizzle/schema';

function getOptions() {
  if (DB_HOST.includes('neon') || ENVIRONMENT === 'production') {
    return { ssl: 'require' as const };
  }

  return undefined
}

const queryClient = postgres(DB_URL, getOptions());

export const db = drizzle(queryClient, { schema, logger: false });
