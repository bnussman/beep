import { RedisPublisher } from '@orpc/publisher/redis'
import { redis } from "./redis";
import type { Location } from "../routers/users/types";
import type { Ride } from "../routers/rider/types";
import type { Queue } from "../routers/beeper/types";
import type { User } from '../routers/users/types';

type PubSubChannels = {
  [key: `user-${string}`]: { user: User },
  [key: `ride-${string}`]: { ride: Partial<Ride> },
  [key: `queue-${string}`]: { queue: Queue },
  locations: { id: string; location: Location };
};

export const pubSub = new RedisPublisher<PubSubChannels>(redis);