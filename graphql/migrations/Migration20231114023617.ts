import { Migration } from '@mikro-orm/migrations';

export class Migration20231114023617 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "payment" alter column "price" type numeric using ("price"::numeric);');
  }

  async down(): Promise<void> {
    this.addSql('alter table "payment" alter column "price" type int using ("price"::int);');
  }

}
