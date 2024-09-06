import { defineConfig } from "drizzle-kit";
import { DB_CA, DB_DATABASE, DB_URL } from "./src/utils/constants";

export default defineConfig({
	schema: 'drizzle/schema.ts',
	dialect: "postgresql",
	extensionsFilters: ["postgis"],
	dbCredentials: {
	  url: DB_URL,
		database: DB_DATABASE,
		ssl: {
 		  ca: DB_CA,
		},
	},
	verbose: true,
	strict: true,
});
