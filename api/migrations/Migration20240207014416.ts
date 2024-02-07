import { Migration } from '@mikro-orm/migrations';

export class Migration20240207014416 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "token" ("id" varchar(255) not null, "tokenid" varchar(255) not null, "user_id" varchar(255) not null, constraint "token_pkey" primary key ("id"));');

    this.addSql('alter table "token" add constraint "token_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');

    this.addSql('drop table if exists "token_entry" cascade;');

    this.addSql('alter table "user" alter column "created" type timestamptz using ("created"::timestamptz);');

    this.addSql('alter table "payment" alter column "created" type timestamptz using ("created"::timestamptz);');
    this.addSql('alter table "payment" alter column "expires" type timestamptz using ("expires"::timestamptz);');

    this.addSql('alter table "forgot_password" alter column "time" type timestamptz using ("time"::timestamptz);');

    this.addSql('alter table "feedback" alter column "created" type timestamptz using ("created"::timestamptz);');

    this.addSql('alter table "car" alter column "created" type timestamptz using ("created"::timestamptz);');
    this.addSql('alter table "car" alter column "updated" type timestamptz using ("updated"::timestamptz);');

    this.addSql('alter table "beep" alter column "start" type timestamptz using ("start"::timestamptz);');
    this.addSql('alter table "beep" alter column "end" type timestamptz using ("end"::timestamptz);');

    this.addSql('alter table "report" alter column "timestamp" type timestamptz using ("timestamp"::timestamptz);');

    this.addSql('alter table "rating" alter column "timestamp" type timestamptz using ("timestamp"::timestamptz);');

    this.addSql('alter table "verify_email" alter column "time" type timestamptz using ("time"::timestamptz);');
  }

  async down(): Promise<void> {
    this.addSql('create table "token_entry" ("id" varchar(255) not null, "tokenid" varchar(255) not null, "user_id" varchar(255) not null, constraint "token_entry_pkey" primary key ("id"));');

    this.addSql('alter table "token_entry" add constraint "token_entry_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');

    this.addSql('drop table if exists "token" cascade;');

    this.addSql('alter table "user" alter column "created" type timestamptz(0) using ("created"::timestamptz(0));');

    this.addSql('alter table "payment" alter column "created" type timestamptz(0) using ("created"::timestamptz(0));');
    this.addSql('alter table "payment" alter column "expires" type timestamptz(0) using ("expires"::timestamptz(0));');

    this.addSql('alter table "forgot_password" alter column "time" type timestamptz(0) using ("time"::timestamptz(0));');

    this.addSql('alter table "feedback" alter column "created" type timestamptz(0) using ("created"::timestamptz(0));');

    this.addSql('alter table "car" alter column "created" type timestamptz(0) using ("created"::timestamptz(0));');
    this.addSql('alter table "car" alter column "updated" type timestamptz(0) using ("updated"::timestamptz(0));');

    this.addSql('alter table "beep" alter column "start" type timestamptz(0) using ("start"::timestamptz(0));');
    this.addSql('alter table "beep" alter column "end" type timestamptz(0) using ("end"::timestamptz(0));');

    this.addSql('alter table "report" alter column "timestamp" type timestamptz(0) using ("timestamp"::timestamptz(0));');

    this.addSql('alter table "rating" alter column "timestamp" type timestamptz(0) using ("timestamp"::timestamptz(0));');

    this.addSql('alter table "verify_email" alter column "time" type timestamptz(0) using ("time"::timestamptz(0));');
  }

}
