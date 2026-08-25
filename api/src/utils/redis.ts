import { createClient } from 'redis';
import { REDIS_URL } from "./constants";

export const redis = createClient({
  url: REDIS_URL
});
