ALTER TABLE "user" DROP CONSTRAINT "user_email_unique";--> statement-breakpoint
CREATE UNIQUE INDEX "user_email_unique_idx" ON "user" (lower("email"));