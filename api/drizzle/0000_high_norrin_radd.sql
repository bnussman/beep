-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE IF NOT EXISTS "geography_columns" (
	"f_table_catalog" "name",
	"f_table_schema" "name",
	"f_table_name" "name",
	"f_geography_column" "name",
	"coord_dimension" integer,
	"srid" integer,
	"type" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "geometry_columns" (
	"f_table_catalog" varchar(256),
	"f_table_schema" "name",
	"f_table_name" "name",
	"f_geometry_column" "name",
	"coord_dimension" integer,
	"srid" integer,
	"type" varchar(30)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "spatial_ref_sys" (
	"srid" integer PRIMARY KEY NOT NULL,
	"auth_name" varchar(256),
	"auth_srid" integer,
	"srtext" varchar(2048),
	"proj4text" varchar(2048)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mikro_orm_migrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"executed_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"first" varchar(255) NOT NULL,
	"last" varchar(255) NOT NULL,
	"username" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(255) NOT NULL,
	"venmo" varchar(255),
	"cashapp" varchar(255),
	"password" varchar(255) NOT NULL,
	"password_type" text DEFAULT 'sha256' NOT NULL,
	"is_beeping" boolean DEFAULT false NOT NULL,
	"is_email_verified" boolean DEFAULT false NOT NULL,
	"is_student" boolean DEFAULT false NOT NULL,
	"group_rate" integer DEFAULT 4 NOT NULL,
	"singles_rate" integer DEFAULT 3 NOT NULL,
	"capacity" integer DEFAULT 4 NOT NULL,
	"queue_size" integer DEFAULT 0 NOT NULL,
	"rating" numeric,
	"role" text DEFAULT 'user' NOT NULL,
	"push_token" varchar(255),
	"photo" varchar(255),
	"location" "geometry",
	"created" timestamp with time zone,
	CONSTRAINT "user_username_unique" UNIQUE("username"),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "token" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"tokenid" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payment" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"store_id" varchar(255) NOT NULL,
	"product_id" text NOT NULL,
	"price" numeric NOT NULL,
	"store" text NOT NULL,
	"created" timestamp with time zone NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "forgot_password" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"time" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "feedback" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"message" varchar(255) NOT NULL,
	"created" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "car" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
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
CREATE TABLE IF NOT EXISTS "beep" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"beeper_id" varchar(255) NOT NULL,
	"rider_id" varchar(255) NOT NULL,
	"origin" varchar(255) NOT NULL,
	"destination" varchar(255) NOT NULL,
	"group_size" integer NOT NULL,
	"start" timestamp with time zone NOT NULL,
	"end" timestamp with time zone,
	"status" text DEFAULT 'complete' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "report" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
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
CREATE TABLE IF NOT EXISTS "rating" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"rater_id" varchar(255) NOT NULL,
	"rated_id" varchar(255) NOT NULL,
	"stars" integer NOT NULL,
	"message" varchar(255),
	"timestamp" timestamp with time zone NOT NULL,
	"beep_id" varchar(255) NOT NULL,
	CONSTRAINT "rating_beep_id_rater_id_unique" UNIQUE("rater_id","beep_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verify_email" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"time" timestamp with time zone NOT NULL,
	"email" varchar(255) NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "token" ADD CONSTRAINT "token_user_id_foreign" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payment" ADD CONSTRAINT "payment_user_id_foreign" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "forgot_password" ADD CONSTRAINT "forgot_password_user_id_foreign" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "feedback" ADD CONSTRAINT "feedback_user_id_foreign" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "car" ADD CONSTRAINT "car_user_id_foreign" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "beep" ADD CONSTRAINT "beep_beeper_id_foreign" FOREIGN KEY ("beeper_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "beep" ADD CONSTRAINT "beep_rider_id_foreign" FOREIGN KEY ("rider_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "report" ADD CONSTRAINT "report_reporter_id_foreign" FOREIGN KEY ("reporter_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "report" ADD CONSTRAINT "report_reported_id_foreign" FOREIGN KEY ("reported_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "report" ADD CONSTRAINT "report_handled_by_id_foreign" FOREIGN KEY ("handled_by_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "report" ADD CONSTRAINT "report_beep_id_foreign" FOREIGN KEY ("beep_id") REFERENCES "public"."beep"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rating" ADD CONSTRAINT "rating_rater_id_foreign" FOREIGN KEY ("rater_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rating" ADD CONSTRAINT "rating_rated_id_foreign" FOREIGN KEY ("rated_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rating" ADD CONSTRAINT "rating_beep_id_foreign" FOREIGN KEY ("beep_id") REFERENCES "public"."beep"("id") ON DELETE no action ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "verify_email" ADD CONSTRAINT "verify_email_user_id_foreign" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "beep_beeper_id_index" ON "beep" USING btree ("beeper_id" text_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "beep_beeper_id_rider_id_index" ON "beep" USING btree ("beeper_id" text_ops,"rider_id" text_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "beep_rider_id_index" ON "beep" USING btree ("rider_id" text_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "beep_start_index" ON "beep" USING btree ("start" timestamptz_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "beep_status_index" ON "beep" USING btree ("status" text_ops);
*/