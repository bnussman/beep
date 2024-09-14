import { defineConfig } from "drizzle-kit";
import { DB_CA, DB_DATABASE, DB_HOST, DB_PASSWORD, DB_URL, DB_USER } from "./src/utils/constants";

export default defineConfig({
	schema: 'drizzle/schema.ts',
	dialect: "postgresql",
	extensionsFilters: ["postgis"],
	dbCredentials: {
	  host: DB_HOST,
		user: DB_USER,
		password: DB_PASSWORD,
		database: DB_DATABASE,
    ssl: DB_HOST.includes('neon') ? "require" : { ca: DB_CA },
	},
	verbose: true,
	strict: true,
});
