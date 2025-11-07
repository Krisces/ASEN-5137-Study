import { db } from "../backend/dbConfig.js";
import { TestResults } from "../backend/schema.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    console.error("Invalid method:", req.method);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Log the incoming request body for debugging
  console.log("Incoming request body:", req.body);

  const { studentEmail, testName, results } = req.body;

  // Validate fields
  if (!studentEmail || !testName || !results || !Array.isArray(results)) {
    console.error("Bad request: missing or invalid fields");
    return res.status(400).json({ error: "Missing or invalid fields" });
  }

  try {
    // Map results to DB format
    const mappedResults = results.map((r) => ({
      studentEmail,
      testName,
      questionType: r.questionType,
      questionId: r.questionId,
      isCorrect: r.isCorrect,
      totalTimeMs: r.totalTimeMs ?? null, // ensure numeric or null
    }));

    console.log("Mapped results to insert:", mappedResults);

    // Insert into database
    const insertedRows = await db.insert(TestResults).values(mappedResults).returning();
    console.log("Inserted test results:", insertedRows);

    return res.status(200).json({ success: true, insertedRows });
  } catch (err) {
    console.error("Database insert failed:", err);
    return res.status(500).json({ error: "Database error", message: err.message });
  }
}
