"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@mikro-orm/core");
const postgresql_1 = require("@mikro-orm/postgresql");
const migrations_1 = require("@mikro-orm/migrations");
const constants_1 = require("./utils/constants");
exports.default = (0, postgresql_1.defineConfig)({
    entities: ["./build/entities/*.js"],
    entitiesTs: ["./src/entities/*.ts"],
    user: constants_1.DB_USER,
    password: constants_1.DB_PASSWORD,
    clientUrl: `${constants_1.DB_URL}/${constants_1.DB_DATABASE}`,
    loadStrategy: core_1.LoadStrategy.JOINED,
    debug: true,
    driverOptions: constants_1.DB_CA
        ? {
            connection: {
                ssl: {
                    ca: constants_1.DB_CA,
                },
            },
        }
        : {},
    extensions: [migrations_1.Migrator],
    migrations: {
        disableForeignKeys: false,
    },
});
