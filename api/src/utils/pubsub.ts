import { Context } from "./trpc.ts";
import { queueResponseSchema, rideResponseSchema } from "../schemas/beep.ts";
import { createPubSub } from "@graphql-yoga/subscription";
import { eventTarget } from "./redis.ts";
import z from "zod";

export type User = NonNullable<Context["user"]>;
export type Ride = z.infer<typeof rideResponseSchema> | null;
type Queue = z.infer<typeof queueResponseSchema>;

type PubSubChannels = {
  user: [userId: string, payload: { user: User }];
  ride: [userId: string, payload: { ride: Ride }];
  rideAllowPartial: [userId: string, payload: { ride: Partial<Ride> }];
  queue: [userId: string, payload: { queue: Queue }];
  locations: [
    payload: { id: string; location: { latitude: number; longitude: number } },
  ];
  beepsCount: [payload: number];
};

export const pubSub = createPubSub<PubSubChannels>({ eventTarget });
