import { Configuration, Connection, IDatabaseDriver, LoadStrategy } from "@mikro-orm/core";
import { DB_CA, DB_DATABASE, DB_PASSWORD, DB_URL, DB_USER, isProduction } from "./utils/constants";

export default {
    entities: ['./build/src/entities/*.js'],
    entitiesTs: ['./src/entities/*.ts'],
    user: DB_USER,
    password: DB_PASSWORD,
    type: 'postgresql',
    clientUrl: `${DB_URL}/${DB_DATABASE}`,
    // clientUrl: `postgresql://db.production.ridebeep.app:5432/beep`,
    loadStrategy: LoadStrategy.JOINED,
    debug: !isProduction,
    // debug: false,
    driverOptions: DB_CA ? {
      connection: {
        ssl: {
          ca: DB_CA,
        }
      }
    } : undefined,
} as unknown as Configuration<IDatabaseDriver<Connection>>
