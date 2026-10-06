import { redis } from "../services/redis";
import { adminProcedure } from "../middleware/orpc";

export const redisRouter = {
  channels: adminProcedure
    .handler(async () => {
      return await redis.pubSubChannels();
    })
};
