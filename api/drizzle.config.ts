import { DB_PASSWORD, DB_URL } from "./src/utils/constants";
import { defineConfig } from "drizzle-kit";

const ssl = DB_PASSWORD !== "beep" ? "?sslmode=require" : "";

if (ssl) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

export default defineConfig({
  schema: "drizzle/schema.ts",
  dialect: "postgresql",
  extensionsFilters: ["postgis"],
  dbCredentials: {
    url: DB_URL + ssl,
  },
  schemaFilter: ["public"],
  tablesFilter: ["*"],
  verbose: true,
  strict: true,
});
