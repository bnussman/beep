import { redis } from "../utils/redis";
import { adminProcedure, router } from "../utils/trpc";

export const redisRouter = router({
  channels: adminProcedure
    .query(async () => {
      return await redis.pubSubChannels();
    })
});
