import { Configuration, Connection, IDatabaseDriver, LoadStrategy } from "@mikro-orm/core";

export default {
    entities: ['./build/src/entities/*.js'],
    entitiesTs: ['./src/entities/*.ts'],
    user: process.env.POSTGRESQL_USER,
    password: process.env.POSTGRESQL_PASSWORD,
    type: 'postgresql',
    clientUrl: `${process.env.POSTGRESQL_URL}/${process.env.POSTGRESQL_DATABASE}`,
    // clientUrl: `postgresql://db.production.ridebeep.app:5432/${process.env.POSTGRESQL_DATABASE}`,
    loadStrategy: LoadStrategy.JOINED,
    debug: false,
} as unknown as Configuration<IDatabaseDriver<Connection>>
