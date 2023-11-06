import { Migration } from '@mikro-orm/migrations';

export class Migration20231106021549 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" add column "is_premium" boolean not null default false;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop column "is_premium";');
  }

}
