import express from "express";
import dotenv from "dotenv";
import initializeDatabase from "./config/initDb.js";

dotenv.config();

console.log("INIT DB TYPE:", typeof initializeDatabase);

const app = express();

await initializeDatabase(); // 🔥 IMPORTANT sur Render

app.use(express.json());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
