import { Migration } from '@mikro-orm/migrations';

export class Migration20231031233007 extends Migration {

  async up(): Promise<void> {
    this.addSql('create index "beep_start_index" on "beep" ("start");');
  }

  async down(): Promise<void> {
    this.addSql('drop index "beep_start_index";');
  }

}
