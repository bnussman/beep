import { Migration } from '@mikro-orm/migrations';

export class Migration20210427182225 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "queue_entry" add column "start" int4 not null;');
    this.addSql('alter table "queue_entry" drop column "time_entered_queue";');

    this.addSql('alter table "beep" rename column "done_time" to "start";');


    this.addSql('alter table "beep" rename column "time_entered_queue" to "end";');


    this.addSql('alter table "beep" drop column "state";');
    this.addSql('alter table "beep" drop column "is_accepted";');
  }

}
