import { EntityManager, MikroORM } from "@mikro-orm/core";

export interface ORM {
    orm: MikroORM,
    em: EntityManager
}
