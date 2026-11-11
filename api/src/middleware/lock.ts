import { lock } from "@orpc/experimental-lock";
import { RedisLocker } from "@orpc/experimental-lock/redis";
import { redis } from "../services/redis";

const locker = new RedisLocker(redis, {
  prefix: "lock:",
  ttl: 5_000,
});

/**
 * Prevents a user from running the same procedure concurrently.
 * Must be used after authentication middleware.
 */
export const withLock = lock<{ user: { id: string } }, unknown>({
  locker,
  key: ({ path, context }) => `${path.join(".")}-${context.user.id}`,
});
