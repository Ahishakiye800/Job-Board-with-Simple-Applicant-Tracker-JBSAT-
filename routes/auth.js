// const express = require('express');
// const router = express.Router();
// const authController = require('../controllers/authController');
// const { authMiddleware } = require('../middleware/auth');


// // Public routes
// router.post('/register', authController.register);
// router.post('/login', authController.login);

// // Protected route
// router.get('/me', authMiddleware, authController.getMe);

// export default router;


import express from 'express';
import { register, login, getMe } from '../controllers/authController.js';
// ADD THIS LINE:
import { authMiddleware } from '../middleware/auth.js'; 

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected route - requires the authMiddleware we just imported
router.get('auth/me', authMiddleware, getMe);

export default router;