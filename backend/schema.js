import { pgTable, serial, varchar, integer, numeric, boolean, timestamp } from "drizzle-orm/pg-core"; // added timestamp

// ==============================
// 🧾 Survey Submissions Table
// ==============================
export const SurveySubmissions = pgTable("survey_submissions", {
  id: serial("id").primaryKey(),
  studentEmail: varchar("student_email", { length: 255 }).notNull(),
  age: integer("age"),
  gender: varchar("gender", { length: 50 }),
  favoriteMusic: varchar("favorite_music", { length: 100 }),
  dailyMusicHours: numeric("daily_music_hours", { precision: 4, scale: 2 }),
  isException: integer("is_exception").notNull(), // 1 if exception
  createdAt: varchar("created_at", { length: 50 }).default(() => new Date().toISOString())
});

// ==============================
// 🧠 Test Results Table
// ==============================
export const TestResults = pgTable("test_results", {
  id: serial("id").primaryKey(),
  studentEmail: varchar("student_email", { length: 255 }).notNull(),
  testName: varchar("test_name", { length: 100 }).notNull(),
  questionType: varchar("question_type", { length: 50 }).notNull(),
  questionId: integer("question_id").notNull(),
  isCorrect: boolean("is_correct").notNull(),
  totalTimeMs: numeric("total_time_ms"),       // total time for the test
  createdAt: timestamp("created_at").defaultNow(),
});
