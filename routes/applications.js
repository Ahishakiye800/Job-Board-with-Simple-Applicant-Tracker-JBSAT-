
const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { authMiddleware, employerOnly, seekerOnly } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

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

module.exports = router;
