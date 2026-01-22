import { publishClient } from "../utils/redis";
import { adminProcedure } from "../utils/trpc";

export const redisRouter = {
  channels: adminProcedure
    .handler(async () => {
      return await publishClient.pubsub('CHANNELS') as string[];
    })
};
