import Redis from "ioredis";
import { createPubSub } from "graphql-yoga";
import { createRedisEventTarget } from "@graphql-yoga/redis-event-target";
import { REDIS_HOST, REDIS_PASSWROD } from "./constants";
import type { User } from "../entities/User";
import type { Beep } from "../entities/Beep";
import type { Point } from "../location/resolver";

const options = {
  host: REDIS_HOST,
  password: REDIS_PASSWROD,
  port: 6379,
};

const publishClient = new Redis(options);
const subscribeClient = new Redis(options)

const eventTarget = createRedisEventTarget({
  publishClient,
  subscribeClient
})

type Subscriptions = {
  user: [userId: string, payload: User];
  location: [userId: string, payload: Point];
  beeperLocation: [payload: Point & { id: string }];
  currentRide: [riderId: string, payload: Beep | null];
  beeperQueue: [beeperId: string, payload: Beep[]];
};

export const pubSub = createPubSub<Subscriptions>({ eventTarget });
