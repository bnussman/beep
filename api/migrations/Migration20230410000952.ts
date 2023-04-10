import { Migration } from '@mikro-orm/migrations';

export class Migration20230410000952 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "feedback" ("id" varchar(255) not null, "user_id" varchar(255) not null, "message" varchar(255) not null, "created" timestamptz(0) not null, constraint "feedback_pkey" primary key ("id"));');

    this.addSql('alter table "feedback" add constraint "feedback_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "feedback" cascade;');
  }

}
