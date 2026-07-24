import { EntityGenerator } from '@mikro-orm/entity-generator';
import { defineConfig } from '@mikro-orm/postgresql';
import { DB_URL } from './utils/constants';

export default defineConfig({
  dbName: 'beep',
  extensions: [EntityGenerator],
  clientUrl: DB_URL,
  entityGenerator: {
    esmImport: false,
  },
});
