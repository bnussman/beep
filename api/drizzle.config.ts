import { DB_URL } from "./src/utils/constants";
import { defineConfig } from "drizzle-kit";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export default defineConfig({
  schema: "drizzle/schema.ts",
  dialect: "postgresql",
  extensionsFilters: ["postgis"],
  dbCredentials: {
    url: DB_URL,
  },
  schemaFilter: ["public"],
  tablesFilter: ["*"],
  verbose: true,
  strict: true,
});
