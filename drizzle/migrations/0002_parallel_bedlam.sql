ALTER TABLE "survey_submissions" ALTER COLUMN "age" SET DEFAULT null;--> statement-breakpoint
ALTER TABLE "survey_submissions" ALTER COLUMN "gender" SET DEFAULT null;--> statement-breakpoint
ALTER TABLE "survey_submissions" ALTER COLUMN "favorite_music" SET DEFAULT null;--> statement-breakpoint
ALTER TABLE "survey_submissions" ALTER COLUMN "daily_music_hours" SET DEFAULT null;--> statement-breakpoint
ALTER TABLE "survey_submissions" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "survey_submissions" ALTER COLUMN "created_at" SET DEFAULT now();