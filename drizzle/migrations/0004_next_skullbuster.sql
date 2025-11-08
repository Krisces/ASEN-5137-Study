ALTER TABLE "test_results" ALTER COLUMN "total_time_ms" SET DEFAULT null;--> statement-breakpoint
ALTER TABLE "test_results" ADD COLUMN "reading_time_ms" numeric DEFAULT null;--> statement-breakpoint
ALTER TABLE "test_results" ADD COLUMN "math_time_ms" numeric DEFAULT null;