import { Migration } from '@mikro-orm/migrations';

export class Migration20220822160833 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "queue_entry" drop column "is_accepted";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "queue_entry" add column "is_accepted" boolean not null;');
  }

}
