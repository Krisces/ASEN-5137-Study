import { db } from "../backend/dbConfig.js";
import { PostSurveySubmissions } from "../backend/schema.js";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method Not Allowed" });

  try {
    const { studentEmail, knownSongs } = req.body;

    if (!studentEmail) return res.status(400).json({ message: "Email required" });
    if (!knownSongs || !Array.isArray(knownSongs)) {
      return res.status(400).json({ message: "Invalid song data" });
    }

    const insertedRows = [];
    for (const { song, familiarity, known } of knownSongs) {
      const result = await db
        .insert(PostSurveySubmissions)
        .values({
          studentEmail: studentEmail.toLowerCase(),
          knewSongs: known,
          knownSongsList: known === "yes" ? song : null,
          familiarityScore: known === "yes" ? Number(familiarity) : null,
        })
        .returning();

      insertedRows.push(result[0]);
    }

    return res.status(200).json({ success: true, rows: insertedRows });
  } catch (err) {
    console.error("Post-survey insert failed:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
}
