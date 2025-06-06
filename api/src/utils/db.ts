import * as schema from '../../drizzle/schema';
import type { ClientConfig } from 'pg';
const { Client } = require("pg"); // we must use `require` because of Bun / Sentry / OpenTelementry weirdness
import { drizzle } from "drizzle-orm/node-postgres";
import { DB_URL, isDevelopment } from "./constants";
import { relations } from '../../drizzle/relations';

const options: ClientConfig = {
  connectionString: DB_URL,
  ssl: !isDevelopment && ({
    rejectUnauthorized: false,
  }),
};

const queryClient = new Client(options);

await queryClient.connect();

export const db = drizzle(queryClient, { schema, relations, logger: isDevelopment });
