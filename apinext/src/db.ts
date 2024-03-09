import * as schema from './schema';
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const client = postgres({
  host: 'localhost',
  password: "beep",
  database: "beep",
  username: "beep"
});

export const db = drizzle(client, { schema, logger: true  });