import { Migration } from '@mikro-orm/migrations';

export class Migration20221007184703 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "car" ("id" varchar(255) not null, "user_id" varchar(255) not null, "make" varchar(255) not null, "model" varchar(255) not null, "color" varchar(255) not null, "photo" varchar(255) not null, "year" int not null, "default" boolean not null default false, "created" timestamptz(0) not null, "updated" timestamptz(0) not null, constraint "car_pkey" primary key ("id"));');

    this.addSql('alter table "car" add constraint "car_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "car" cascade;');
  }

}
