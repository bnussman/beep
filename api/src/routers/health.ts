import { redis as redisClient } from "../utils/redis";
import { db as dbClient } from "../utils/db";
import { publicProcedure, router } from "../utils/trpc";
import { sql } from "drizzle-orm";

export const healthRouter = router({
  /**
   *  Access this at http://localhost:3000/health.healthcheck or (https://api.ridebeep.app/health.healthcheck)
   */
  healthcheck: publicProcedure
    .query(async () => {
      return {
        uptime: process.uptime(),
        services: {
          redis: await getRedisStatus(),
          db: await getDatabaseStatus()
        }
      };
    })
});

async function getRedisStatus() {
  const start = performance.now();
  const redisPing = await redisClient.ping(); // Should throw is redis is offline

  const end = performance.now();

  const isRedisHealthy = redisPing === "PONG";

  return {
     latency: end - start,
     online: isRedisHealthy,
   };
}

async function getDatabaseStatus() {
  const start = performance.now();

  const databasePing = await dbClient.execute(sql`select 1 = 1`); // Show throw if the Database is offline

  const end = performance.now();

  const isDatabaseHealthy = Object.values(databasePing[0])[0] === true;

  return {
    latency: end - start,
    online: isDatabaseHealthy,
  };
}
