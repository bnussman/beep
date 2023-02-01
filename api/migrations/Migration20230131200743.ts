import { Migration } from '@mikro-orm/migrations';

export class Migration20230131200743 extends Migration {

  async up(): Promise<void> {
    // this.addSql('drop table if exists "queue_entry" cascade;');

    this.addSql('alter table "user" drop constraint if exists "user_role_check";');

    this.addSql('alter table "user" alter column "is_beeping" type boolean using ("is_beeping"::boolean);');
    this.addSql('alter table "user" alter column "is_beeping" set default false;');
    this.addSql('alter table "user" alter column "is_email_verified" type boolean using ("is_email_verified"::boolean);');
    this.addSql('alter table "user" alter column "is_email_verified" set default false;');
    this.addSql('alter table "user" alter column "is_student" type boolean using ("is_student"::boolean);');
    this.addSql('alter table "user" alter column "is_student" set default false;');
    this.addSql('alter table "user" alter column "group_rate" type int using ("group_rate"::int);');
    this.addSql('alter table "user" alter column "group_rate" set default 4;');
    this.addSql('alter table "user" alter column "singles_rate" type int using ("singles_rate"::int);');
    this.addSql('alter table "user" alter column "singles_rate" set default 3;');
    this.addSql('alter table "user" alter column "capacity" type int using ("capacity"::int);');
    this.addSql('alter table "user" alter column "capacity" set default 4;');
    this.addSql('alter table "user" alter column "queue_size" type int using ("queue_size"::int);');
    this.addSql('alter table "user" alter column "queue_size" set default 0;');
    this.addSql('alter table "user" alter column "role" type text using ("role"::text);');
    this.addSql('alter table "user" add constraint "user_role_check" check ("role" in (\'admin\', \'user\'));');
    this.addSql('alter table "user" alter column "role" set default \'user\';');

    this.addSql('alter table "beep" add column "status" text check ("status" in (\'denied\', \'waiting\', \'accepted\', \'on_the_way\', \'here\', \'in_progress\', \'complete\')) not null default \'complete\';');
    this.addSql('alter table "beep" alter column "end" type timestamptz(0) using ("end"::timestamptz(0));');
    this.addSql('alter table "beep" alter column "end" drop not null;');
  }

  async down(): Promise<void> {
    // this.addSql('create table "queue_entry" ("id" varchar(255) not null, "origin" varchar(255) not null, "destination" varchar(255) not null, "state" int not null, "group_size" int not null, "start" bigint not null, "beeper_id" varchar(255) not null, "rider_id" varchar(255) not null, constraint "queue_entry_pkey" primary key ("id"));');
    // this.addSql('alter table "queue_entry" add constraint "queue_entry_rider_id_unique" unique ("rider_id");');

    // this.addSql('alter table "queue_entry" add constraint "queue_entry_beeper_id_foreign" foreign key ("beeper_id") references "user" ("id") on update cascade;');
    // this.addSql('alter table "queue_entry" add constraint "queue_entry_rider_id_foreign" foreign key ("rider_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "user" drop constraint if exists "user_role_check";');

    this.addSql('alter table "user" alter column "is_beeping" drop default;');
    this.addSql('alter table "user" alter column "is_beeping" type boolean using ("is_beeping"::boolean);');
    this.addSql('alter table "user" alter column "is_email_verified" drop default;');
    this.addSql('alter table "user" alter column "is_email_verified" type boolean using ("is_email_verified"::boolean);');
    this.addSql('alter table "user" alter column "is_student" drop default;');
    this.addSql('alter table "user" alter column "is_student" type boolean using ("is_student"::boolean);');
    this.addSql('alter table "user" alter column "group_rate" drop default;');
    this.addSql('alter table "user" alter column "group_rate" type int using ("group_rate"::int);');
    this.addSql('alter table "user" alter column "singles_rate" drop default;');
    this.addSql('alter table "user" alter column "singles_rate" type int using ("singles_rate"::int);');
    this.addSql('alter table "user" alter column "capacity" drop default;');
    this.addSql('alter table "user" alter column "capacity" type int using ("capacity"::int);');
    this.addSql('alter table "user" alter column "queue_size" drop default;');
    this.addSql('alter table "user" alter column "queue_size" type int using ("queue_size"::int);');
    this.addSql('alter table "user" alter column "role" drop default;');
    this.addSql('alter table "user" alter column "role" type text using ("role"::text);');
    this.addSql('alter table "user" add constraint "user_role_check" check ("role" in (\'admin\', \'user\'));');

    this.addSql('alter table "beep" alter column "end" type timestamptz(0) using ("end"::timestamptz(0));');
    this.addSql('alter table "beep" alter column "end" set not null;');
    this.addSql('alter table "beep" drop column "status";');
  }

}
