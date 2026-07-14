import { publishClient } from "../utils/redis.ts";
import { adminProcedure, router } from "../utils/trpc.ts";

export const redisRouter = router({
  channels: adminProcedure
    .query(async () => {
      return await publishClient.pubsub('CHANNELS') as string[];
    })
});
