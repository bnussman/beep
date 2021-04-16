import { Migration } from '@mikro-orm/migrations';

export class Migration20210416154921 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "queue_entry" drop constraint if exists "queue_entry_time_entered_queue_check";');
    this.addSql('alter table "queue_entry" alter column "time_entered_queue" type timestamptz(0) using ("time_entered_queue"::timestamptz(0));');
    this.addSql('alter table "queue_entry" alter column "time_entered_queue" set default now();');
  }

}
