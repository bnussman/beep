import { MikroORM } from '@mikro-orm/postgresql';
import config from '../mikro-orm.config';

export const orm = await MikroORM.init(config);
