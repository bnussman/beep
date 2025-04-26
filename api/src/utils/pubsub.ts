import { getRidersCurrentRide } from "../routers/rider";
import { Context } from "./trpc";
import { getBeeperQueue } from "./beep";
import { createPubSub } from "@graphql-yoga/subscription";
import { createRedisEventTarget } from "@graphql-yoga/redis-event-target";
import { REDIS_HOST, REDIS_PASSWROD } from "./constants";
import Redis from "ioredis";

const publishClient = new Redis({
  host: REDIS_HOST,
  password: REDIS_PASSWROD,
});
const subscribeClient = new Redis({
  host: REDIS_HOST,
  password: REDIS_PASSWROD,
});

const eventTarget = createRedisEventTarget({
  publishClient,
  subscribeClient,
});

type PubSubChannels = {
  user: [userId: string, payload: { user: NonNullable<Context["user"]> }];
  ride: [
    userId: string,
    payload: { ride: Awaited<ReturnType<typeof getRidersCurrentRide>> },
  ];
  queue: [
    userId: string,
    payload: { queue: Awaited<ReturnType<typeof getBeeperQueue>> },
  ];
};

export const newPubSub = createPubSub<PubSubChannels>({ eventTarget });
