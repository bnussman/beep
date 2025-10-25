import Redis from "ioredis";
import { REDIS_HOST, REDIS_PASSWROD } from "./constants";
import { createRedisEventTarget } from "@graphql-yoga/redis-event-target";

export const redis = new Redis({
  host: REDIS_HOST,
  password: REDIS_PASSWROD,
});

export const publishClient = new Redis({
  host: REDIS_HOST,
  password: REDIS_PASSWROD,
});

export const subscribeClient = new Redis({
  host: REDIS_HOST,
  password: REDIS_PASSWROD,
});

export const eventTarget = createRedisEventTarget({
  publishClient,
  subscribeClient,
});
