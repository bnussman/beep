import Redis from "ioredis";
import { User, UserRole } from "../entities/User";
import { REDIS_HOST, REDIS_PASSWROD } from "../utils/constants";
import { Authorized, Ctx, Query, Resolver } from "type-graphql";
import { Context } from "../utils/context";
import { sql } from "@mikro-orm/core";

@Resolver()
export class AdminResolver {
  @Query(() => [String])
  @Authorized(UserRole.ADMIN)
  public async getRedisChannels(): Promise<string[]> {
    const redis = new Redis({
      host: REDIS_HOST,
      password: REDIS_PASSWROD,
      port: 6379,
    });

    const channels = await redis.pubsub("CHANNELS") as string[];

    return channels;
  }

  @Query(() => [String])
  @Authorized(UserRole.ADMIN)
  public async getUsersWithDuplicateEmails(@Ctx() ctx: Context): Promise<string[]> {
    // SELECT DISTINCT lower(email) FROM public.user
    //  WHERE UPPER(email) INy
    // (SELECT UPPER(email) FROM public.user GROUP BY UPPER(email) HAVING COUNT(*) > 1)
    //
    // { ['COUNT(email)']: { $gt: 1 }}

    const qb2 = ctx.em.createQueryBuilder(User).select(sql`lower(email)`).groupBy(sql`lower(email)`).having("COUNT(*) > 1");

    console.log("---", qb2.getKnexQuery())
    const qb1 = ctx.em.createQueryBuilder(User).select(sql`lower(email)`, true).where({ [sql`lower(email)`]: { $in: qb2.getKnexQuery() }});

    const result = await qb1.execute();

    console.log(result);

    return [];
  }
}
