import { Migration } from '@mikro-orm/migrations';

export class Migration20231114023255 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "payment" add column "price" int not null;');
    this.addSql('alter table "payment" alter column "product_id" type text using ("product_id"::text);');
    this.addSql('alter table "payment" add constraint "payment_product_id_check" check ("product_id" in (\'top_of_beeper_list_1_hour\', \'top_of_beeper_list_2_hours\', \'top_of_beeper_list_3_hours\'));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "payment" drop constraint if exists "payment_product_id_check";');

    this.addSql('alter table "payment" alter column "product_id" type varchar(255) using ("product_id"::varchar(255));');
    this.addSql('alter table "payment" drop column "price";');
  }

}
