import { defineConfig } from "drizzle-kit";
import { DB_CA, DB_DATABASE, DB_PASSWORD, DB_URL, DB_USER } from './src/constants';

export default defineConfig({
	schema: 'src/schema.ts',
	dialect: "postgresql",
	dbCredentials: {
	   url: "posgresql://beep:beep@localhost/beep",
		 // user: DB_USER,
		 // host: "localhost",
		 // password: DB_PASSWORD,
		 // database: DB_DATABASE,
		  ssl: {
 		   ca: DB_CA,
		  },
	},
	verbose: true,
	strict: true,
});
