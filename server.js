import express from 'express';
import cors from 'cors';
import 'dotenv/config'; 


import { initializeDatabase } from './config/database.js'; 

const app = express();


console.log("INIT DB TYPE:", typeof initializeDatabase);
try {
    await initializeDatabase();
    console.log("✅ Database initialized");
} catch (error) {
    console.error("❌ Database initialization error:", error);
}

// Middleware
app.use(cors({
  origin: [
    "http://localhost:3000",
  ],
  credentials: true
}));


app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Job Board API is running!' });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is healthy and running',
    timestamp: new Date().toISOString()
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
