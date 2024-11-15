import * as  schema from '../../drizzle/schema';
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { DB_HOST, DB_URL, ENVIRONMENT } from "./constants";

const ssl = DB_HOST.includes('neon') || ENVIRONMENT === "production" ? "?sslmode=require" : '';

const queryClient = new Pool({
  connectionString: DB_URL + ssl
});

await queryClient.connect();

export const db = drizzle(queryClient, { schema, logger: false });
