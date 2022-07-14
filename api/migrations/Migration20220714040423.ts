import { Migration } from '@mikro-orm/migrations';

export class Migration20220714040423 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" drop column "masks_required";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" add column "masks_required" bool not null default null;');
  }

}
