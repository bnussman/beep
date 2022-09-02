import { Migration } from '@mikro-orm/migrations';

export class Migration20220831172757 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" add column "password_type" text check ("password_type" in (\'sha256\', \'bcrypt\')) not null default \'sha256\';');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop column "password_type";');
  }

}
