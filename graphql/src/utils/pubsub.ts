import { createPubSub } from "@graphql-yoga/subscription";
import { eventTarget } from "./redis";
import { beep, user } from "../../drizzle/schema";

export type User = typeof user.$inferSelect;

type Beep = typeof beep.$inferSelect;

type Ride = Beep | null;
type Queue = Beep[];

type PubSubChannels = {
  user: [userId: string, payload: { user: User }];
  ride: [userId: string, payload: { ride: Ride }];
  queue: [userId: string, payload: { queue: Queue }];
  locations: [
    payload: { id: string; location: { latitude: number; longitude: number } },
  ];
};

export const pubSub = createPubSub<PubSubChannels>({ eventTarget });
