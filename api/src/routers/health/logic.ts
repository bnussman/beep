import { sql } from "drizzle-orm";
import { db } from "../../utils/db";
import { redis } from "../../utils/redis";

export async function getRedisStatus() {
  const start = performance.now();
  const redisPing = await redis.ping(); // Should throw is redis is offline

  const end = performance.now();

  const isRedisHealthy = redisPing === "PONG";

  return {
     latency: end - start,
     online: isRedisHealthy,
   };
}

export async function getDatabaseStatus() {
  const start = performance.now();

  const databasePing = await db.execute(sql`select 1 = 1`); // Show throw if the Database is offline

  const end = performance.now();

  const isDatabaseHealthy = Object.values(databasePing.rows[0])[0] === true;

  return {
    latency: end - start,
    online: isDatabaseHealthy,
  };
}