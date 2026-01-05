import express from 'express';
import cors from 'cors';
import 'dotenv/config'; 
import { initializeDatabase } from './config/database.js'; 

// Import Routes
import authRoutes from './routes/auth.js';
import jobRoutes from './routes/jobs.js';
import applicationRoutes from './routes/applications.js';


if (!process.env.JWT_SECRET) {
  console.error("❌ FATAL ERROR: JWT_SECRET is not defined in the environment variables.");
  process.exit(1); 
}

const app = express();


try {
    await initializeDatabase();
    console.log("✅ Database initialized successfully");
} catch (error) {
    console.error("❌ Database initialization error:", error);
    // We don't necessarily kill the process, but we log the failure
}


app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-url.onrender.com'] 
    : '*', 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use('/uploads', express.static('uploads')); 


app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Job Board API', status: 'Active' });
});


app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);


app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});



app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`
  });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
