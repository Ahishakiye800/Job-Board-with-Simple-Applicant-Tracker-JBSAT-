import express from 'express';
import { 
  submitApplication, 
  getSeekerApplications, 
  getJobApplications, 
  getEmployerApplications, 
  updateApplicationStatus, 
  getApplicationStats 
} from '../controllers/applicationController.js'; 
import { authMiddleware, employerOnly, seekerOnly } from '../middleware/auth.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

// --- SEEKER ROUTES ---

// Submit an application (POST /api/applications)
router.post(
  '/',
  authMiddleware,
  seekerOnly,
  upload.single('resume'), // Handle PDF/Doc upload to Cloudinary
  submitApplication
);

// Get my applications (GET /api/applications/my-applications)
router.get(
  '/my-applications',
  authMiddleware,
  seekerOnly,
  getSeekerApplications
);

// --- EMPLOYER ROUTES ---

// Stats for employer (GET /api/applications/employer/stats)
// Note: Put specific routes BEFORE dynamic :id routes
router.get(
  '/employer/stats',
  authMiddleware,
  employerOnly,
  getApplicationStats
);

router.get(
  '/employer/all',
  authMiddleware,
  employerOnly,
  getEmployerApplications
);

// Get applications for a specific job (GET /api/applications/job/:jobId)
router.get(
  '/job/:jobId',
  authMiddleware,
  employerOnly,
  getJobApplications
);

// Update status (PUT /api/applications/:id/status)
router.put(
  '/:id/status',
  authMiddleware,
  employerOnly,
  updateApplicationStatus
);


export default router;
