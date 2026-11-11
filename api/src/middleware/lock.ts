import { lock } from "@orpc/experimental-lock";
import { RedisLocker } from "@orpc/experimental-lock/redis";
import { redis } from "../services/redis";
import { authCheckerMiddleware } from "./authentication";
import { o } from "../services/orpc";

const locker = new RedisLocker(redis, {
  prefix: "lock:",
  ttl: 5_000,
});

/**
 * Prevents a user from running the same procedure concurrently.
 */
export const withLock = o
.use(authCheckerMiddleware)
.use(
  lock({
    locker,
    key: ({ path, context }) => `${path.join(".")}-${context.user.id}`,
  })
);
