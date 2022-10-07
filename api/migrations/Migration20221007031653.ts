import { Migration } from '@mikro-orm/migrations';

export class Migration20221007031653 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "car" add column "default" boolean not null default false;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "car" drop column "default";');
  }

}
