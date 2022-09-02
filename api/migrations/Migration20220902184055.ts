import { Migration } from '@mikro-orm/migrations';

export class Migration20220902184055 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" rename column "photo_url" to "picture";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" rename column "picture" to "photo_url";');
  }

}
