import express from "express";
import { db } from "../dbConfig.js";
import { SurveySubmissions } from "../schema.js";

const router = express.Router();

router.post("/submit", async (req, res) => {
  try {
    const { studentEmail, age, gender, favoriteMusic, dailyMusicHours, isException } = req.body;

    // Simple validation
    if (!studentEmail) return res.status(400).json({ message: "Email required" });

    // Save to database
    const result = await db.insert(SurveySubmissions).values({
      studentEmail: studentEmail.toLowerCase(),
      age: age || null,
      gender: gender || null,
      favoriteMusic: favoriteMusic || null,
      dailyMusicHours: dailyMusicHours || null,
      isException: isException ? 1 : 0
    });

    return res.json({ success: true, id: result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
