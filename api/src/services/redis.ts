import { createClient } from 'redis';
import { REDIS_URL } from "../utilities/constants";

export const redis = createClient({
  url: REDIS_URL
});

await redis.connect();