import * as  schema from '../../drizzle/schema';
import { Client } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { DB_HOST, DB_URL, ENVIRONMENT } from "./constants";

const ssl = DB_HOST.includes('neon') || ENVIRONMENT === "production" ? "?sslmode=require" : '';

const queryClient = new Client(DB_URL + ssl);

export const db = drizzle(queryClient, { schema, logger: false });
