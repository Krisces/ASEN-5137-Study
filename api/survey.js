import { db } from "../backend/dbConfig.js";
import { SurveySubmissions } from "../backend/schema.js";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method Not Allowed" });

  try {
    const {
      studentEmail,
      age,
      gender,
      major,
      isMusician,
      musicalExperience,
      favoriteMusic,
      dailyMusicHours,
      isException
    } = req.body;

    if (!studentEmail) return res.status(400).json({ message: "Email required" });

    const ageVal =
      age !== undefined && age !== "" ? Number(age) : null;
    const dailyMusicHoursVal =
      dailyMusicHours !== undefined && dailyMusicHours !== "" ? Number(dailyMusicHours) : null;

    const result = await db
      .insert(SurveySubmissions)
      .values({
        studentEmail: studentEmail.toLowerCase(),
        age: ageVal,
        gender: gender || null,
        major: major || null,
        isMusician: isMusician || null,
        musicalExperience: musicalExperience || null,
        favoriteMusic: favoriteMusic || null,
        dailyMusicHours: dailyMusicHoursVal,
        isException: isException ? 1 : 0,
      })
      .returning();

    console.log("Survey inserted:", result);

    return res.status(200).json({ success: true, row: result });
  } catch (err) {
    console.error("Survey insert failed:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
}
