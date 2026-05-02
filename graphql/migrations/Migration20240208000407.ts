import { Migration } from '@mikro-orm/migrations';

export class Migration20240208000407 extends Migration {
  async up(): Promise<void> {
    this.addSql('ALTER TABLE "token_entry" RENAME TO "token";');
    this.addSql('ALTER INDEX "token_entry_pkey" RENAME TO "token_pkey";');
  }

  async down(): Promise<void> {
    this.addSql('ALTER TABLE "token" RENAME TO "token_entry";');
    this.addSql('ALTER INDEX "token_pkey" RENAME TO "token_entry_pkey";');
  }
}
