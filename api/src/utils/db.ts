import * as schema from '../../drizzle/schema';
import type { ClientConfig } from 'pg';
const { Client } = require("pg"); // we must use `require` because of Bun / Sentry / OpenTelementry weirdness
import { drizzle } from "drizzle-orm/node-postgres";
import { DB_URL, ENVIRONMENT, isDevelopment } from "./constants";

const options: ClientConfig = {
  connectionString: DB_URL,
  ssl: ENVIRONMENT === "production" || ENVIRONMENT === "staging" ? {
    rejectUnauthorized: false,
  } : undefined,
};

const queryClient = new Client(options);

await queryClient.connect();

export const db = drizzle(queryClient, { schema, logger: isDevelopment });
