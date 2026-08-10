import type { ClientConfig, Client as ClientType } from "pg";
const { Client } = require("pg") as { Client: typeof ClientType }; // we must use `require` because of Bun / Sentry / OpenTelementry weirdness
import { drizzle } from "drizzle-orm/node-postgres";
import { DB_URL } from "./constants";
import { relations } from "../../drizzle/relations";

const options: ClientConfig = {
  connectionString: DB_URL,
  ssl: {
    rejectUnauthorized: false,
  },
};

const queryClient = new Client(options);
const writeQueryClient = new Client(options);

await queryClient.connect();
await writeQueryClient.connect();
await writeQueryClient.query("SET synchronous_commit = off;");

export const db = drizzle({
  client: queryClient,
  logger: false,
  relations,
});

export const writeDB = drizzle({
  client: writeQueryClient,
  logger: false,
  relations,
});