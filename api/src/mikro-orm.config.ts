import { Configuration, Connection, IDatabaseDriver, LoadStrategy } from "@mikro-orm/core";

export default {
    entities: ['./build/entities/*.js'],
    entitiesTs: ['./src/entities/*.ts'],
    user: 'banks',
    password: process.env.POSTGRESQL_PASSWORD,
    type: 'postgresql',
    clientUrl: 'postgresql://postgresql.nussman.us:5432/beep',
    loadStrategy: LoadStrategy.JOINED,
    debug: true,
} as unknown as Configuration<IDatabaseDriver<Connection>>
