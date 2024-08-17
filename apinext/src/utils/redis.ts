import { createClient } from 'redis';
import { REDIS_HOST, REDIS_PASSWROD } from './constants';

export const redis = createClient({
  url: `redis://${REDIS_HOST}`,
  password: REDIS_PASSWROD,
});

await redis.connect();

export const redisSubscriber = redis.duplicate();

redisSubscriber.on('error', err => console.error(err));

await redisSubscriber.connect();
