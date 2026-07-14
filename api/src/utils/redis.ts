import ioredis from "ioredis"; // I have to use `require` to make Sentry's Redis integration work
import { REDIS_HOST, REDIS_PASSWROD } from "./constants.ts";
import { createRedisEventTarget } from "@graphql-yoga/redis-event-target";

export const redis = new ioredis.Redis({
  host: REDIS_HOST,
  password: REDIS_PASSWROD,
});

export const publishClient = new ioredis.Redis({
  host: REDIS_HOST,
  password: REDIS_PASSWROD,
});

export const subscribeClient = new ioredis.Redis({
  host: REDIS_HOST,
  password: REDIS_PASSWROD,
});

export const eventTarget = createRedisEventTarget({
  publishClient,
  subscribeClient,
});
