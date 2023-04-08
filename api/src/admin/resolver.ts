import Redis from "ioredis";
import { UserRole } from "../entities/User";
import { REDIS_HOST, REDIS_PASSWROD } from "../utils/constants";
import { Authorized, Query, Resolver } from "type-graphql";

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
}