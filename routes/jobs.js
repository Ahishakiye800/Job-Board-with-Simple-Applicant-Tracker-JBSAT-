
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
import { getMyJobs, getAllJobs, createJob } from '../controllers/jobController.js';
import { authMiddleware, employerOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/employer/my-jobs', authMiddleware, employerOnly, getMyJobs);

// GET /api/jobs
router.get('/', async (req, res) => {
  // Logic: Fetch all jobs from DB
  res.json([{ id: 1, title: "Frontend Developer", company: "TechCorp" }]);
});

// POST /api/jobs (Employer Only)
router.post('/', async (req, res) => {
  res.status(201).json({ message: "Job created successfully" });
});

export default router;