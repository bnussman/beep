import { defineConfig } from "drizzle-kit";
import { DB_DATABASE, DB_HOST, DB_URL, ENVIRONMENT } from "./src/utils/constants";

const ssl = DB_HOST.includes('neon') || ENVIRONMENT === "production" ? "?sslmode=require" : '';

export default defineConfig({
	schema: 'drizzle/schema.ts',
	dialect: "postgresql",
	extensionsFilters: ["postgis"],
	dbCredentials: {
	  url: DB_URL + ssl,
	},
	verbose: true,
	strict: true,
});
