import { db } from "../backend/dbConfig.js";
import { PostSurveySubmissions } from "../backend/schema.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { studentEmail, knownSongs } = req.body;

    if (!studentEmail) return res.status(400).json({ message: "Email required" });
    if (!knownSongs || !Array.isArray(knownSongs) || knownSongs.length === 0) {
      return res.status(400).json({ message: "Must select at least one song" });
    }

    // We'll save each song as a separate row in post_survey_submissions
    const insertedRows = [];
    for (const songData of knownSongs) {
      const { song, familiarity } = songData;
      const result = await db
        .insert(PostSurveySubmissions)
        .values({
          studentEmail: studentEmail.toLowerCase(),
          knewSongs: "yes",
          knownSongsList: song,
          familiarityScore: Number(familiarity),
        })
        .returning();

      insertedRows.push(result[0]);
    }

    console.log("Post-survey inserted:", insertedRows);

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
