import { Options, LoadStrategy } from "@mikro-orm/core";
import { DB_CA, DB_DATABASE, DB_PASSWORD, DB_URL, DB_USER, isDevelopment } from "./utils/constants";

const config: Options = {
  entities: ['./build/entities/*.js'],
  entitiesTs: ['./src/entities/*.ts'],
  user: DB_USER,
  password: DB_PASSWORD,
  type: 'postgresql',
  clientUrl: `${DB_URL}/${DB_DATABASE}`,
  loadStrategy: LoadStrategy.JOINED,
  debug: isDevelopment,
  driverOptions: DB_CA ? {
    connection: {
      ssl: {
        ca: DB_CA,
      }
    }
  } : {},
  migrations: {
    allOrNothing: false,
  }
};

export default config;
