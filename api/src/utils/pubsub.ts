import { getRidersCurrentRide } from "../routers/rider";
import { Context } from "./trpc";
import { getBeeperQueue } from "./beep";
import { createPubSub } from "@graphql-yoga/subscription";
import { eventTarget } from "./redis";

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

export const pubSub = createPubSub<PubSubChannels>({ eventTarget });
