// /api/survey.js
import { db } from "../backend/dbConfig.js";
import { SurveySubmissions } from "../backend/schema.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const {
      studentEmail,
      age,
      gender,
      favoriteMusic,
      dailyMusicHours,
      isException
    } = req.body;

    if (!studentEmail) {
      return res.status(400).json({ message: "Email required" });
    }

    // Ensure optional fields are null if empty
    const ageVal = age !== undefined && age !== "" ? Number(age) : null;
    const dailyMusicHoursVal =
      dailyMusicHours !== undefined && dailyMusicHours !== ""
        ? Number(dailyMusicHours)
        : null;
    const genderVal = gender || null;
    const favoriteMusicVal = favoriteMusic || null;
    const isExceptionVal = isException ? 1 : 0;

    console.log("Survey submission payload:", {
      studentEmail,
      age: ageVal,
      gender: genderVal,
      favoriteMusic: favoriteMusicVal,
      dailyMusicHours: dailyMusicHoursVal,
      isException: isExceptionVal
    });

    // Insert into Neon DB
    const result = await db.insert(SurveySubmissions).values({
      studentEmail: studentEmail.toLowerCase(),
      age: ageVal,
      gender: genderVal,
      favoriteMusic: favoriteMusicVal,
      dailyMusicHours: dailyMusicHoursVal,
      isException: isExceptionVal
      // createdAt handled by defaultNow()
    });

    console.log("Insert result:", result);

    return res.status(200).json({ success: true, id: result });
  } catch (err) {
    console.error("Survey insert failed:", err);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
}
