ALTER TABLE "survey_submissions" ADD COLUMN "major" varchar(100) DEFAULT null;--> statement-breakpoint
ALTER TABLE "survey_submissions" ADD COLUMN "is_musician" varchar(10) DEFAULT null;--> statement-breakpoint
ALTER TABLE "survey_submissions" ADD COLUMN "musical_experience" varchar(255) DEFAULT null;