CREATE TABLE "post_survey_submissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_email" varchar(255) NOT NULL,
	"knew_songs" varchar(5) NOT NULL,
	"known_songs_list" varchar(500) DEFAULT null,
	"familiarity_score" numeric(4, 2) DEFAULT null,
	"created_at" timestamp DEFAULT now()
);
