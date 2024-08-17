import Redis from 'ioredis';
import { REDIS_HOST, REDIS_PASSWROD } from './constants';

export const redisPublisher = new Redis({
  host: REDIS_HOST,
  password: REDIS_PASSWROD,
  lazyConnect: true,
});

export const redisSubscriber = new Redis({
  host: REDIS_HOST,
  password: REDIS_PASSWROD,
  lazyConnect: true,
});
