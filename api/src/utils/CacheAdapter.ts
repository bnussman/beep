import { CacheAdapter } from '@mikro-orm/core';
import Redis from 'ioredis';
import type {Redis as RedisType, RedisOptions} from 'ioredis';

export interface BaseOptions {
  expiration?: number
  debug?: boolean;
}

export interface BuildOptions extends BaseOptions, RedisOptions {}
export interface ClientOptions extends BaseOptions {
  client: RedisType
}

export type RedisCacheAdapterOptions = BuildOptions | ClientOptions;

export class RedisCacheAdapter implements CacheAdapter {
  private readonly client: RedisType;
  private readonly debug: boolean;
  private readonly expiration?: number;

  constructor(options: RedisCacheAdapterOptions) {
    const {debug = true, expiration} = options;
    if((options as ClientOptions).client) {
      this.client = (options as ClientOptions).client
    } else {
      const {...redisOpt} = options as BuildOptions;
      console.log(redisOpt);
      this.client = new Redis(redisOpt);
    }
    this.debug = true;
    this.expiration = 60000;
    console.log(`~~~~~~~~~~~ redis client created`);
  }

  async get(key: string) {
    const data = await this.client.get(key);
    console.log(`~~~~~~~~~~~ get "${key}": "${data}"`);
    if(!data) return null;
    return JSON.parse(data)
  }

  async set(
    name: string,
    data: any,
    origin: string,
    expiration = this.expiration,
  ): Promise<void> {
    const stringData = JSON.stringify(data);
    console.log(`set "${name}": "${stringData}" with expiration ${expiration}`);
    if(expiration) {
      await this.client.set(name, stringData,'PX', expiration)
    } else {
      await this.client.set(name, stringData)
    }
  }

  async clear(): Promise<void> {
      console.log('clear cache');
    await this.client.flushdb();
  }
}
