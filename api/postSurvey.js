import { db } from "../backend/dbConfig.js";
import { PostSurveySubmissions } from "../backend/schema.js";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method Not Allowed" });

  try {
    const { studentEmail, knewSongs, knownSongsList, familiarityScore } = req.body;

    if (!studentEmail) return res.status(400).json({ message: "Email required" });
    if (!knewSongs) return res.status(400).json({ message: "Must specify if songs were known." });

    const result = await db
      .insert(PostSurveySubmissions)
      .values({
        studentEmail: studentEmail.toLowerCase(),
        knewSongs,
        knownSongsList: knownSongsList || null,
        familiarityScore:
          familiarityScore !== undefined && familiarityScore !== "" ? Number(familiarityScore) : null,
      })
      .returning();

    console.log("Post-survey inserted:", result);

    return res.status(200).json({ success: true, row: result });
  } catch (err) {
    console.error("Post-survey insert failed:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
}
