import { RedisPublisher } from '@orpc/publisher/redis'
import { redis } from "./redis";
import type { Location } from "../types/users";
import type { Ride } from "../types/rider";
import type { Queue } from "../types/beeper";
import type { User } from '../types/users';
import type { Beep } from '../types/beeps';

type PubSubChannels = {
  [key: `user-${string}`]: { user: User },
  [key: `beep-${string}`]: { beep: Partial<Beep> },
  [key: `ride-${string}`]: { ride: Partial<Ride> },
  [key: `queue-${string}`]: { queue: Queue },
  locations: { id: string; location: Location };
};

export const pubSub = new RedisPublisher<PubSubChannels>(redis);