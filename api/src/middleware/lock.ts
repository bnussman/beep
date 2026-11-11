import { ORPCError } from "@orpc/server";
import { LockTimeoutError } from "@orpc/experimental-lock";
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
  .middleware(async function handleLock({ next, path, context, signal }) {
    const key = `${path.join(".")}-${context.user.id}`;

    try {
      return await locker.lock(key, () => next(), { signal });
    } catch (error) {
      if (error instanceof LockTimeoutError) {
        throw new ORPCError("CONFLICT", { cause: error });
      }
      throw error;
    }
  });
