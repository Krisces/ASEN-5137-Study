import { db } from "../backend/dbConfig.js";
import { TestResults } from "../backend/schema.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { studentEmail, testName, results } = req.body;

    if (!studentEmail || !testName || !results || !results.length) {
      console.log("Bad request body:", req.body);
      return res.status(400).json({ error: "Missing or empty fields" });
    }

    // ensure numeric values
    const formattedResults = results.map((r) => ({
      studentEmail: studentEmail.toLowerCase(),
      testName,
      questionType: r.questionType,
      questionId: r.questionId,
      status: r.status || "no_time",
      totalTimeMs: Number(r.totalTimeMs ?? null),
      readingTimeMs: Number(r.readingTimeMs ?? null),
      mathTimeMs: Number(r.mathTimeMs ?? null),
    }));

    console.log("Inserting results:", formattedResults);

    await db.insert(TestResults).values(formattedResults);

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error saving test results:", err);
    res.status(500).json({ error: "Database error" });
  }
}
