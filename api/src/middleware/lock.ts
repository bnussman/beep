import { createLock, NodeRedisAdapter } from "redlock-universal";
import { redis } from "../services/redis";
import { authCheckerMiddleware } from "./authentication";
import { o } from "../services/orpc";

export const withLock = o
  .use(authCheckerMiddleware)
  .middleware(async function handleLock(opts) {
    const lock = createLock({
      adapter: new NodeRedisAdapter(redis),
      key: `${opts.path}-${opts.context.user.id}`,
      ttl: 5_000,
    });

    const handle = await lock.acquire();

    const result = await opts.next(opts);

    await lock.release(handle);

    return result;
  });

