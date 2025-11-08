import { db } from "../backend/dbConfig.js";
import { TestResults } from "../backend/schema.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { studentEmail, testName, results } = req.body;

    if (!studentEmail || !testName || !results) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // Insert all results into the database
    await db.insert(TestResults).values(
      results.map((r) => ({
        studentEmail: studentEmail.toLowerCase(),
        testName,
        questionType: r.questionType,
        questionId: r.questionId,
        status: r.status || "no_time",
        totalTimeMs: r.totalTimeMs ?? null,
        readingTimeMs: r.readingTimeMs ?? null,
        mathTimeMs: r.mathTimeMs ?? null,
      }))
    );

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error saving test results:", err);
    res.status(500).json({ error: "Database error" });
  }
}
