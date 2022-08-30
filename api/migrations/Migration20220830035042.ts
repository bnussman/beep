import { Migration } from '@mikro-orm/migrations';

export class Migration20220830035042 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "password" ("id" varchar(255) not null, "type" text check ("type" in (\'sha256\', \'bcrypt\')) not null, "password" varchar(255) not null, "created" timestamptz(0) not null, constraint "password_pkey" primary key ("id"));');

    this.addSql('alter table "user" rename column "password" to "password_id";');
    this.addSql('alter table "user" add constraint "user_password_id_foreign" foreign key ("password_id") references "password" ("id") on update cascade;');
    this.addSql('alter table "user" add constraint "user_password_id_unique" unique ("password_id");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop constraint "user_password_id_foreign";');

    this.addSql('drop table if exists "password" cascade;');

    this.addSql('alter table "user" drop constraint "user_password_id_unique";');
    this.addSql('alter table "user" rename column "password_id" to "password";');
  }

}
