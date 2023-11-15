import { Migration } from '@mikro-orm/migrations';

export class Migration20231031220325 extends Migration {

  async up(): Promise<void> {
    this.addSql('create index "beep_beeper_id_index" on "beep" ("beeper_id");');
    this.addSql('create index "beep_rider_id_index" on "beep" ("rider_id");');
  }

  async down(): Promise<void> {
    this.addSql('drop index "beep_beeper_id_index";');
    this.addSql('drop index "beep_rider_id_index";');
  }

}
