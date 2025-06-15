import { createPubSub } from "@graphql-yoga/subscription";
import { eventTarget } from "./redis";

type PubSubChannels = {
  user: [userId: string, payload: { user: unknown }];
  ride: [userId: string, payload: { ride: unknown }];
  queue: [userId: string, payload: { queue: unknown }];
  locations: [payload: { id: string, location: { latitude: number, longitude: number } }]
};

export const pubSub = createPubSub<PubSubChannels>({ eventTarget });
