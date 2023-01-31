import { Migration } from '@mikro-orm/migrations';

export class Migration20230131225037 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "beep" drop constraint if exists "beep_status_check";');

    this.addSql('alter table "beep" alter column "status" type text using ("status"::text);');
    this.addSql('alter table "beep" add constraint "beep_status_check" check ("status" in (\'canceled\', \'denied\', \'waiting\', \'accepted\', \'on_the_way\', \'here\', \'in_progress\', \'complete\'));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "beep" drop constraint if exists "beep_status_check";');

    this.addSql('alter table "beep" alter column "status" type text using ("status"::text);');
    this.addSql('alter table "beep" add constraint "beep_status_check" check ("status" in (\'denied\', \'waiting\', \'accepted\', \'on_the_way\', \'here\', \'in_progress\', \'complete\'));');
  }

}
