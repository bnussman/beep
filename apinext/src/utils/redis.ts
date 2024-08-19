import { createClient } from 'redis';
import { REDIS_HOST, REDIS_PASSWROD } from './constants';
import * as Sentry from '@sentry/bun';

export const redis = createClient({
  url: `redis://${REDIS_HOST}`,
  password: REDIS_PASSWROD,
});

await redis.connect();

export const redisSubscriber = redis.duplicate();

redisSubscriber.on('error', (error) => {
  Sentry.captureException(error);
  console.error(error);
});

await redisSubscriber.connect();
