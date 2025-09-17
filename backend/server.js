import dotenv from "dotenv";
import path from "path";

// Load the .env file from project root
dotenv.config({ path: path.resolve("./.env") });

console.log("DATABASE_URL:", process.env.DATABASE_URL); // Should print your value

import express from "express";
import cors from "cors";
import surveyRoutes from "./routes/survey.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api/survey", surveyRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
