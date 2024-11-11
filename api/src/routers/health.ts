import { redis as redisClient } from "../utils/redis";
import { db as dbClient } from "../utils/db";
import { publicProcedure, router } from "../utils/trpc";
import { sql } from "drizzle-orm";

export const healthRouter = router({
  /**
   *  Access this at http://localhost:3000/health.healthcheck
   */
  healthcheck: publicProcedure
    .query(async () => {
      const redisPing = await redisClient.ping(); // Should throw is redis is offline

      const isRedisHealthy = redisPing === "PONG";

      const databasePing = await dbClient.execute(sql`select 1 = 1`); // Show throw if the Database is offline

      const isDatabaseHealthy = Object.values(databasePing[0])[0] === true;

      return { redis: isRedisHealthy, db: isDatabaseHealthy };
    })
});
