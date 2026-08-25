import { Context } from "./orpc";
import { queueResponseSchema, rideResponseSchema } from "../schemas/beep";
import { RedisPublisher } from '@orpc/publisher/redis'
import z from "zod";
import { redis } from "./redis";

export type User = NonNullable<Context["user"]>;
export type Ride = z.infer<typeof rideResponseSchema> | null;
type Queue = z.infer<typeof queueResponseSchema>;
type LocationUpdate = { id: string; location: { latitude: number; longitude: number } };

type PubSubChannels = {
  [key: `user-${string}`]: { user: User },
  [key: `ride-${string}`]: { ride: Partial<Ride> },
  [key: `queue-${string}`]: { queue: Queue },
  locations: LocationUpdate;
};

export const pubSub = new RedisPublisher<PubSubChannels>(redis);