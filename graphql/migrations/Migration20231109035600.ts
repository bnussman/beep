import { Migration } from '@mikro-orm/migrations';

export class Migration20231109035600 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "payment" ("id" varchar(255) not null, "user_id" varchar(255) not null, "store_id" varchar(255) not null, "product_id" varchar(255) not null, "store" text check ("store" in (\'play_store\', \'app_store\')) not null, "created" timestamptz(0) not null, "expires" timestamptz(0) not null, constraint "payment_pkey" primary key ("id"));');

    this.addSql('alter table "payment" add constraint "payment_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "payment" cascade;');
  }

}
