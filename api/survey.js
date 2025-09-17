import { db } from "../backend/dbConfig.js";
import { SurveySubmissions } from "../backend/schema.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { studentEmail, age, gender, favoriteMusic, dailyMusicHours, isException } = req.body;

    if (!studentEmail) return res.status(400).json({ message: "Email required" });

    const result = await db.insert(SurveySubmissions).values({
      studentEmail: studentEmail.toLowerCase(),
      age: age || null,
      gender: gender || null,
      favoriteMusic: favoriteMusic || null,
      dailyMusicHours: dailyMusicHours || null,
      isException: isException ? 1 : 0
    });

    return res.status(200).json({ success: true, id: result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
