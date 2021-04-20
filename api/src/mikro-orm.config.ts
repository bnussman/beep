import { LoadStrategy } from "@mikro-orm/core";

export default {
    entities: ['./build/entities/*.js'],
    entitiesTs: ['./src/entities/*.ts'],
    user: 'banks',
    password: 'beep',
    type: 'postgresql',
    clientUrl: 'postgresql://postgresql.nussman.us:5432/beep',
    loadStrategy: LoadStrategy.JOINED,
    debug: true,
}
