import Redis from 'ioredis';
import { REDIS_HOST, REDIS_PASSWROD } from './constants';

export const redis = new Redis({
  host: REDIS_HOST,
  password: REDIS_PASSWROD,
  lazyConnect: true,
});
