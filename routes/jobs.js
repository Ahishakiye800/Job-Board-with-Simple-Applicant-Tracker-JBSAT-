
// const express = require('express');
// const router = express.Router();
// const jobController = require('../controllers/jobController');
// const { authMiddleware, employerOnly } = require('../middleware/auth');

// // Public routes
// router.get('/', jobController.getAllJobs);
// router.get('/:id', jobController.getJobById);

// // Protected routes (Employer only)
// router.post('/', authMiddleware, employerOnly, jobController.createJob);
// router.get('/employer/my-jobs', authMiddleware, employerOnly, jobController.getEmployerJobs);
// router.get('/employer/stats', authMiddleware, employerOnly, jobController.getEmployerStats);
// router.put('/:id', authMiddleware, employerOnly, jobController.updateJob);
// router.delete('/:id', authMiddleware, employerOnly, jobController.deleteJob);

// module.exports = router;





import express from 'express';
// CHANGE: getMyJobs -> getEmployerJobs
import { 
  getEmployerJobs, 
  getAllJobs, 
  createJob, 
  getJobById, 
  updateJob, 
  deleteJob 
} from '../controllers/jobController.js'; 
import { authMiddleware, employerOnly } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllJobs);

// Employer routes (Specific routes must come BEFORE dynamic :id routes)
router.get('/employer/my-jobs', authMiddleware, employerOnly, getEmployerJobs);

// Dynamic routes
router.get('/:id', getJobById);
router.put('/:id', authMiddleware, employerOnly, updateJob);
router.delete('/:id', authMiddleware, employerOnly, deleteJob);

export default router;