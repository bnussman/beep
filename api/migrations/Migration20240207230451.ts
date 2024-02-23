import { Migration } from '@mikro-orm/migrations';

export class Migration20240207230451 extends Migration {

  async up(): Promise<void> {
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
