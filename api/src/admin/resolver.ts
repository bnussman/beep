import Redis from "ioredis";
import { User, UserRole } from "../entities/User";
import { REDIS_HOST, REDIS_PASSWROD } from "../utils/constants";
import { Authorized, Ctx, Query, Resolver } from "type-graphql";
import { Context } from "../utils/context";

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

  @Query(() => [User])
  @Authorized(UserRole.ADMIN)
  public async getUsersWithDuplicateEmails(@Ctx() ctx: Context): Promise<User[]> {
    const usersWithDuplicateEmails = await ctx.em.execute(`
     SELECT * FROM "user"
     WHERE UPPER(email) IN
     (SELECT UPPER(email) FROM "user" GROUP BY UPPER(email) HAVING COUNT(*) > 1)
     ORDER BY email
   `);

    return usersWithDuplicateEmails as User[];
  }
}
