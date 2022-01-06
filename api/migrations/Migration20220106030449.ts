import { Migration } from '@mikro-orm/migrations';

export class Migration20220106030449 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" rename column "seen" to "created";');
  }

}
