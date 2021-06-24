import { Migration } from '@mikro-orm/migrations';

export class Migration20210624014111 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "verify_email" drop constraint if exists "verify_email_time_check";');
    this.addSql('alter table "verify_email" alter column "time" type timestamptz(0) using ("time"::timestamptz(0));');
    this.addSql('alter table "verify_email" alter column "time" drop default;');
  }

}
