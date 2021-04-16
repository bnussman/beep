import { LoadStrategy } from "@mikro-orm/core";

export default {
    entities: ['./build/entities/*.js'],
    entitiesTs: ['./src/entities/*.ts'],
    user: 'banks',
    password: 'beep',
    type: 'postgresql',
    clientUrl: 'postgresql://192.168.1.137:5432/beep',
    debug: true,
    loadStrategy: LoadStrategy.JOINED,
}
