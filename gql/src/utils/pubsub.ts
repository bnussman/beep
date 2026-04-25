import { Context } from "./trpc";
import { createPubSub } from "@graphql-yoga/subscription";
import { eventTarget } from "./redis";
import z from "zod";
import { user } from "../../drizzle/schema";

export type User = typeof user.$inferSelect;

type Ride = z.infer<typeof rideResponseSchema> | null;
type Queue = z.infer<typeof queueResponseSchema>;

type PubSubChannels = {
  user: [userId: string, payload: { user: User }];
  ride: [userId: string, payload: { ride: Ride }];
  queue: [userId: string, payload: { queue: Queue }];
  locations: [
    payload: { id: string; location: { latitude: number; longitude: number } },
  ];
};

export const pubSub = createPubSub<PubSubChannels>({ eventTarget });
