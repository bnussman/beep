CREATE TYPE "beep_status" AS ENUM('canceled', 'denied', 'waiting', 'accepted', 'on_the_way', 'here', 'in_progress', 'complete');--> statement-breakpoint
CREATE TYPE "payment_product" AS ENUM('top_of_beeper_list_1_hour', 'top_of_beeper_list_2_hours', 'top_of_beeper_list_3_hours');--> statement-breakpoint
CREATE TYPE "payment_store" AS ENUM('play_store', 'app_store');--> statement-breakpoint
CREATE TYPE "user_password_type" AS ENUM('sha256', 'bcrypt');--> statement-breakpoint
CREATE TYPE "user_role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "beep" (
	"id" varchar(255) PRIMARY KEY,
	"beeper_id" varchar(255) NOT NULL,
	"rider_id" varchar(255) NOT NULL,
	"origin" varchar(255) NOT NULL,
	"destination" varchar(255) NOT NULL,
	"group_size" integer NOT NULL,
	"start" timestamp with time zone NOT NULL,
	"end" timestamp with time zone,
	"status" "beep_status" DEFAULT 'waiting'::"beep_status" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "car" (
	"id" varchar(255) PRIMARY KEY,
	"user_id" varchar(255) NOT NULL,
	"make" varchar(255) NOT NULL,
	"model" varchar(255) NOT NULL,
	"color" varchar(255) NOT NULL,
	"photo" varchar(255) NOT NULL,
	"year" integer NOT NULL,
	"default" boolean DEFAULT false NOT NULL,
	"created" timestamp with time zone NOT NULL,
	"updated" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "feedback" (
	"id" varchar(255) PRIMARY KEY,
	"user_id" varchar(255) NOT NULL,
	"message" varchar(255) NOT NULL,
	"created" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "forgot_password" (
	"id" varchar(255) PRIMARY KEY,
	"user_id" varchar(255) NOT NULL,
	"time" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment" (
	"id" varchar(255) PRIMARY KEY,
	"user_id" varchar(255) NOT NULL,
	"store_id" varchar(255) NOT NULL,
	"product_id" "payment_product" NOT NULL,
	"price" numeric NOT NULL,
	"store" "payment_store" NOT NULL,
	"created" timestamp with time zone NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rating" (
	"id" varchar(255) PRIMARY KEY,
	"rater_id" varchar(255) NOT NULL,
	"rated_id" varchar(255) NOT NULL,
	"stars" integer NOT NULL,
	"message" varchar(255),
	"timestamp" timestamp with time zone NOT NULL,
	"beep_id" varchar(255) NOT NULL,
	CONSTRAINT "rating_beep_id_rater_id_unique" UNIQUE("rater_id","beep_id")
);
--> statement-breakpoint
CREATE TABLE "report" (
	"id" varchar(255) PRIMARY KEY,
	"reporter_id" varchar(255) NOT NULL,
	"reported_id" varchar(255) NOT NULL,
	"handled_by_id" varchar(255),
	"reason" varchar(255) NOT NULL,
	"notes" varchar(255),
	"timestamp" timestamp with time zone NOT NULL,
	"handled" boolean DEFAULT false NOT NULL,
	"beep_id" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "token" (
	"id" varchar(255) PRIMARY KEY,
	"tokenid" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" varchar(255) PRIMARY KEY,
	"first" varchar(255) NOT NULL,
	"last" varchar(255) NOT NULL,
	"username" varchar(255) NOT NULL CONSTRAINT "user_username_unique" UNIQUE,
	"email" varchar(255) NOT NULL CONSTRAINT "user_email_unique" UNIQUE,
	"phone" varchar(255) NOT NULL,
	"venmo" varchar(255),
	"cashapp" varchar(255),
	"password" varchar(255) NOT NULL,
	"password_type" "user_password_type" DEFAULT 'bcrypt'::"user_password_type" NOT NULL,
	"is_beeping" boolean DEFAULT false NOT NULL,
	"is_email_verified" boolean DEFAULT false NOT NULL,
	"is_student" boolean DEFAULT false NOT NULL,
	"group_rate" integer DEFAULT 4 NOT NULL,
	"singles_rate" integer DEFAULT 3 NOT NULL,
	"capacity" integer DEFAULT 4 NOT NULL,
	"queue_size" integer DEFAULT 0 NOT NULL,
	"rating" numeric,
	"role" "user_role" DEFAULT 'user'::"user_role" NOT NULL,
	"push_token" varchar(255),
	"photo" varchar(255),
	"location" geometry,
	"created" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "verify_email" (
	"id" varchar(255) PRIMARY KEY,
	"user_id" varchar(255) NOT NULL,
	"time" timestamp with time zone NOT NULL,
	"email" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE INDEX "beeper_id_idx" ON "beep" ("beeper_id");--> statement-breakpoint
CREATE INDEX "beeper_id_rider_id_idx" ON "beep" ("beeper_id","rider_id");--> statement-breakpoint
CREATE INDEX "rider_id_idx" ON "beep" ("rider_id");--> statement-breakpoint
CREATE INDEX "start_idx" ON "beep" ("start");--> statement-breakpoint
CREATE INDEX "status_idx" ON "beep" ("status");--> statement-breakpoint
ALTER TABLE "beep" ADD CONSTRAINT "beep_beeper_id_user_id_fkey" FOREIGN KEY ("beeper_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "beep" ADD CONSTRAINT "beep_rider_id_user_id_fkey" FOREIGN KEY ("rider_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "car" ADD CONSTRAINT "car_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "forgot_password" ADD CONSTRAINT "forgot_password_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "payment" ADD CONSTRAINT "payment_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "rating" ADD CONSTRAINT "rating_rater_id_user_id_fkey" FOREIGN KEY ("rater_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "rating" ADD CONSTRAINT "rating_rated_id_user_id_fkey" FOREIGN KEY ("rated_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "rating" ADD CONSTRAINT "rating_beep_id_beep_id_fkey" FOREIGN KEY ("beep_id") REFERENCES "beep"("id") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "report" ADD CONSTRAINT "report_reporter_id_user_id_fkey" FOREIGN KEY ("reporter_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "report" ADD CONSTRAINT "report_reported_id_user_id_fkey" FOREIGN KEY ("reported_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "report" ADD CONSTRAINT "report_handled_by_id_user_id_fkey" FOREIGN KEY ("handled_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "report" ADD CONSTRAINT "report_beep_id_beep_id_fkey" FOREIGN KEY ("beep_id") REFERENCES "beep"("id") ON DELETE SET NULL ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "token" ADD CONSTRAINT "token_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "verify_email" ADD CONSTRAINT "verify_email_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;