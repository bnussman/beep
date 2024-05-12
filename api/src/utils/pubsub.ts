import Redis from "ioredis";
import { createPubSub } from "graphql-yoga";
import { createRedisEventTarget } from "@graphql-yoga/redis-event-target";
import { REDIS_HOST, REDIS_PASSWROD } from "./constants";
import type { User } from "../entities/User";
import type { Beep } from "../entities/Beep";
import type { Point } from "../location/resolver";
import type { AnonymousBeeper } from "../beeper/resolver";

const options = {
  host: REDIS_HOST,
  password: REDIS_PASSWROD,
  port: 6379,
  lazyConnect: true,
};

const eventTarget = createRedisEventTarget({
  publishClient: new Redis(options),
  subscribeClient: new Redis(options)
});

type Subscriptions = {
  user: [userId: string, payload: User];
  location: [userId: string, payload: Point];
  beeperLocation: [payload: AnonymousBeeper];
  currentRide: [riderId: string, payload: Beep | null];
  beeperQueue: [beeperId: string, payload: Beep[]];
};

export const pubSub = createPubSub<Subscriptions>({ eventTarget });
