import { RedisPublisher } from '@orpc/publisher/redis'
import { redis } from "./redis";
import type { Location } from "../schemas/users-types";
import type { Ride } from "../schemas/rider-types";
import type { Queue } from "../schemas/beeper-types";
import type { User } from '../schemas/users-types';
import type { Beep } from '../schemas/beeps-types';

type PubSubChannels = {
  [key: `user-${string}`]: { user: User },
  [key: `beep-${string}`]: { beep: Partial<Beep> },
  [key: `ride-${string}`]: { ride: Partial<Ride> },
  [key: `queue-${string}`]: { queue: Queue },
  locations: { id: string; location: Location };
};

export const pubSub = new RedisPublisher<PubSubChannels>(redis);