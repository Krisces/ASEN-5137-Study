import { serial, varchar, integer, numeric, pgTable } from "drizzle-orm/pg-core";

// Table for survey submissions
export const SurveySubmissions = pgTable("survey_submissions", {
  id: serial("id").primaryKey(),
  studentEmail: varchar("student_email").notNull(),
  age: integer("age"),
  gender: varchar("gender"),
  favoriteMusic: varchar("favorite_music"),
  dailyMusicHours: numeric("daily_music_hours"),
  isException: integer("is_exception").notNull(), // 1 if exception
  createdAt: varchar("created_at").default(() => new Date().toISOString())
});
