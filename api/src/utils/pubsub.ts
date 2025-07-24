import { getRidersCurrentRide } from "../routers/rider";
import { Context } from "./trpc";
import { getBeeperQueue } from "../logic/beep";
import { createPubSub } from "@graphql-yoga/subscription";
import { eventTarget } from "./redis";

type User = NonNullable<Context["user"]>;
type Ride = Awaited<ReturnType<typeof getRidersCurrentRide>>
type Queue = Awaited<ReturnType<typeof getBeeperQueue>>

type PubSubChannels = {
  user: [userId: string, payload: { user: User }];
  ride: [userId: string, payload: { ride: Ride }];
  queue: [userId: string, payload: { queue: Queue }];
  locations: [payload: { id: string, location: { latitude: number, longitude: number } }]
};

export const pubSub = createPubSub<PubSubChannels>({ eventTarget });
