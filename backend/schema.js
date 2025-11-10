import { pgTable, serial, varchar, integer, numeric, timestamp } from "drizzle-orm/pg-core"; // added timestamp

// ==============================
// 🧾 Survey Submissions Table
// ==============================
export const SurveySubmissions = pgTable("survey_submissions", {
  id: serial("id").primaryKey(),
  studentEmail: varchar("student_email", { length: 255 }).notNull(),
  age: integer("age").default(null),
  gender: varchar("gender", { length: 50 }).default(null),
  major: varchar("major", { length: 100 }).default(null),
  isMusician: varchar("is_musician", { length: 10 }).default(null), // "yes" / "no"
  musicalExperience: varchar("musical_experience", { length: 255 }).default(null),
  favoriteMusic: varchar("favorite_music", { length: 100 }).default(null),
  dailyMusicHours: numeric("daily_music_hours", { precision: 4, scale: 2 }).default(null),
  isException: integer("is_exception").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// ==============================
// 🧠 Test Results Table
// ==============================
export const TestResults = pgTable("test_results", {
  id: serial("id").primaryKey(),
  studentEmail: varchar("student_email", { length: 255 }).notNull(),
  testName: varchar("test_name", { length: 100 }).notNull(),
  questionType: varchar("question_type", { length: 50 }).notNull(), // "reading" or "math"
  questionId: integer("question_id").notNull(),
  status: varchar("status", { length: 10 }).notNull(), // right, wrong, no_time
  totalTimeMs: numeric("total_time_ms").default(null), // total test time
  readingTimeMs: numeric("reading_time_ms").default(null), // for reading question(s)
  mathTimeMs: numeric("math_time_ms").default(null), // for math question(s)
  createdAt: timestamp("created_at").defaultNow(),
});


