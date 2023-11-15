import { Migration } from '@mikro-orm/migrations';

export class Migration20231027015047 extends Migration {

  async up(): Promise<void> {
    this.addSql('create index "beep_beeper_id_rider_id_index" on "beep" ("beeper_id", "rider_id");');
  }

  async down(): Promise<void> {
    this.addSql('drop index "beep_beeper_id_rider_id_index";');
  }

}
