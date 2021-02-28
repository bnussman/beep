import { EntityManager } from "@mikro-orm/core";
import { TokenEntry } from "../entities/TokenEntry";
import { User } from "../entities/User";

export interface Context {
    em: EntityManager;
    user: User;
    token: TokenEntry;
}
