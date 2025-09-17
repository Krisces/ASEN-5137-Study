CREATE TABLE "survey_submissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_email" varchar NOT NULL,
	"age" integer,
	"gender" varchar,
	"favorite_music" varchar,
	"daily_music_hours" numeric,
	"is_exception" integer NOT NULL,
	"created_at" varchar
);
