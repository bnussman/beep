import type { ClientConfig } from "pg";
import { Client } from "pg"; // we must use `require` because of Bun / Sentry / OpenTelementry weirdness
import { drizzle } from "drizzle-orm/node-postgres";
import { DB_URL } from "./constants.ts";
import { relations } from "../../drizzle/relations.ts";

const options: ClientConfig = {
  connectionString: DB_URL,
  ssl: {
    rejectUnauthorized: false,
  },
};

const queryClient = new Client(options);

await queryClient.connect();

export const db = drizzle({
  client: queryClient,
  logger: false,
  relations,
});
