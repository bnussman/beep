import { redis } from "../services/redis";
import { adminProcedure } from "../services/orpc";

export const redisRouter = {
  channels: adminProcedure
    .handler(async () => {
      return await redis.pubSubChannels();
    })
};
