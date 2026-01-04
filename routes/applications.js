import express from 'express';
const router = express.Router();

// NOTE: You must update these imports to use 'import' and add '.js' extensions
import * as applicationController from '../controllers/applicationController.js';
import { authMiddleware, employerOnly, seekerOnly } from '../middleware/auth.js';
import { upload } from '../config/cloudinary.js';

// Seeker routes
router.post(
  '/',
  authMiddleware,
  seekerOnly,
  upload.single('resume'),
  applicationController.submitApplication
);

router.get(
  '/my-applications',
  authMiddleware,
  seekerOnly,
  applicationController.getSeekerApplications
);

// Employer routes
router.get(
  '/job/:jobId',
  authMiddleware,
  employerOnly,
  applicationController.getJobApplications
);

router.get(
  '/employer/all',
  authMiddleware,
  employerOnly,
  applicationController.getEmployerApplications
);

router.put(
  '/:id/status',
  authMiddleware,
  employerOnly,
  applicationController.updateApplicationStatus
);

router.get(
  '/employer/stats',
  authMiddleware,
  employerOnly,
  applicationController.getApplicationStats
);

// CHANGE THIS:
export default router;