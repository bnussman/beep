import { Migration } from '@mikro-orm/migrations';

export class Migration20231027011333 extends Migration {

  async up(): Promise<void> {
    this.addSql('create index "beep_status_index" on "beep" ("status");');
  }

  async down(): Promise<void> {
    this.addSql('drop index "beep_status_index";');
  }

}
