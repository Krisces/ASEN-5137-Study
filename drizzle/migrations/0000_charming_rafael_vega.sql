CREATE TABLE "survey_submissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_email" varchar(255) NOT NULL,
	"age" integer,
	"gender" varchar(50),
	"favorite_music" varchar(100),
	"daily_music_hours" numeric(4, 2),
	"is_exception" integer NOT NULL,
	"created_at" varchar(50)
);
--> statement-breakpoint
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
