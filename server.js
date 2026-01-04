import express from "express";
import dotenv from "dotenv";
import initializeDatabase from "./config/initDb.js";

dotenv.config();

const app = express();

initializeDatabase(); // ✅ MAINTENANT ÇA MARCHE

app.use(express.json());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
