import { defineConfig } from "drizzle-kit";
import { DB_DATABASE, DB_HOST, DB_URL, ENVIRONMENT } from "./src/utils/constants";

export default defineConfig({
	schema: 'drizzle/schema.ts',
	dialect: "postgresql",
	extensionsFilters: ["postgis"],
	dbCredentials: {
	  url: DB_URL,
		database: DB_DATABASE,
    ssl: DB_HOST.includes('neon') || ENVIRONMENT === "production" ? "require" : undefined,
	},
	verbose: true,
	strict: true,
});
