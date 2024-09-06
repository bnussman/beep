import { defineConfig } from "drizzle-kit";
import { DB_CA, DB_URL } from "./src/utils/constants";

export default defineConfig({
	schema: 'drizzle/schema.ts',
	dialect: "postgresql",
	dbCredentials: {
	  url: DB_URL,
		ssl: {
 		  ca: DB_CA,
		},
	},
	verbose: true,
	strict: true,
});
