CREATE TABLE "test_results" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_email" varchar(255) NOT NULL,
	"test_name" varchar(100) NOT NULL,
	"question_type" varchar(50) NOT NULL,
	"question_id" integer NOT NULL,
	"is_correct" boolean NOT NULL,
	"total_time_ms" numeric,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "survey_submissions" ALTER COLUMN "student_email" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "survey_submissions" ALTER COLUMN "gender" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "survey_submissions" ALTER COLUMN "favorite_music" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "survey_submissions" ALTER COLUMN "daily_music_hours" SET DATA TYPE numeric(4, 2);--> statement-breakpoint
ALTER TABLE "survey_submissions" ALTER COLUMN "created_at" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "survey_submissions" ALTER COLUMN "created_at" SET DEFAULT () => (/* @__PURE__ */ new Date()).toISOString();