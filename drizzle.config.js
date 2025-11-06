import dotenv from "dotenv";
dotenv.config();

export default {
  schema: "./backend/schema.js",       // path to your schema file
  out: "./drizzle/migrations",         // migration folder
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL      // Neon connection string
  },
};
