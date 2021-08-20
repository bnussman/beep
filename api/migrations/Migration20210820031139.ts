import { Migration } from '@mikro-orm/migrations';

export class Migration20210820031139 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "queue_entry" add constraint "queue_entry_rider_id_unique" unique ("rider_id");');
  }

}
