import { EntityManager } from "@mikro-orm/core";
import { User } from "../entities/User";
import { UsersResponse } from "./resolver";

export async function search(
    em: EntityManager,
    offset: number = 0,
    show: number = 500,
    query: string
): Promise<UsersResponse> {
    const connection = em.getConnection();

    const raw: User[] = await connection.execute(`select * from public.user where to_tsvector(id || ' ' || first|| ' '  || username || ' ' || last || ' ' || email) @@ to_tsquery('${query}') limit ${show} offset ${offset};`);
    const count = await connection.execute(`select count(*) from public.user where to_tsvector(id || ' ' || first|| ' '  || username || ' ' || last || ' ' || email) @@ to_tsquery('${query}')`);

    const users = raw.map(user => em.map(User, user));
    return {
        items: users,
        count: count[0].count
    };
}
