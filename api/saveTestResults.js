import { db } from "../backend/dbConfig.js";
import { TestResults } from "../backend/schema.js";

export async function POST(req) {
  try {
    const { studentEmail, testName, results } = await req.json();

    if (!studentEmail || !testName || !results) {
      return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
    }

    // Insert all results
    await db.insert(TestResults).values(
      results.map((r) => ({
        studentEmail,
        testName,
        questionType: r.questionType,
        questionId: r.questionId,
        isCorrect: r.isCorrect,
        responseTimeMs: r.responseTimeMs ?? null,
      }))
    );

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Database error" }), { status: 500 });
  }
}
