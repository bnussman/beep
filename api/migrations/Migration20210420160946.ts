import { Migration } from '@mikro-orm/migrations';

export class Migration20210420160946 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "location" drop constraint if exists "location_accuracy_check";');
    this.addSql('alter table "location" alter column "accuracy" type int4 using ("accuracy"::int4);');
    this.addSql('alter table "location" alter column "accuracy" drop not null;');
    this.addSql('alter table "location" drop constraint if exists "location_altitude_accuracy_check";');
    this.addSql('alter table "location" alter column "altitude_accuracy" type int4 using ("altitude_accuracy"::int4);');
    this.addSql('alter table "location" alter column "altitude_accuracy" drop not null;');
  }

}
