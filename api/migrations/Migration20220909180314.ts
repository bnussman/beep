import { Migration } from '@mikro-orm/migrations';

export class Migration20220909180314 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" rename column "photo_url" to "photo";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" rename column "photo" to "photo_url";');
  }

}
