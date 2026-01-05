import express from 'express';
import { 
  getEmployerJobs, 
  getAllJobs, 
  createJob, 
  getJobById, 
  updateJob, 
  deleteJob,
  getEmployerStats 
} from '../controllers/jobController.js'; 
import { authMiddleware, employerOnly } from '../middleware/auth.js';

const router = express.Router();

// --- Routes Publiques ---
router.get('/', getAllJobs);

// --- Routes Employeurs (Spécifiques d'abord) ---
router.post('/', authMiddleware, employerOnly, createJob);
router.get('/employer/my-jobs', authMiddleware, employerOnly, getEmployerJobs);
router.get('/employer/stats', authMiddleware, employerOnly, getEmployerStats);

// --- Routes avec ID (À la fin) ---
router.get('/:id', getJobById);
router.put('/:id', authMiddleware, employerOnly, updateJob);
router.delete('/:id', authMiddleware, employerOnly, deleteJob);

export default router;