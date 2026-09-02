import { redis } from "../../utils/redis";
import { adminProcedure } from "../../utils/orpc";

export const redisRouter = {
  channels: adminProcedure
    .handler(async () => {
      return await redis.pubSubChannels();
    })
};
