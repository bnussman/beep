import { LoadStrategy } from "@mikro-orm/core";
import { defineConfig } from "@mikro-orm/postgresql";
import { Migrator } from "@mikro-orm/migrations";
import {
  DB_CA,
  DB_DATABASE,
  DB_PASSWORD,
  DB_URL,
  DB_USER,
  isDevelopment,
} from "./utils/constants";

export default defineConfig({
  entities: ["./build/entities/*.js"],
  // entitiesTs: ["./src/entities/*.ts"], we can only run in compiled mode
  user: DB_USER,
  password: DB_PASSWORD,
  clientUrl: `${DB_URL}/${DB_DATABASE}`,
  loadStrategy: LoadStrategy.JOINED,
  debug: isDevelopment,
  driverOptions: DB_CA
    ? {
        connection: {
          ssl: {
            ca: DB_CA,
          },
        },
      }
    : {},
  extensions: [Migrator],
  migrations: {
    disableForeignKeys: false,
  },
});
