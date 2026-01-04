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
const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    // logic: Hash password, save user to DB, generate JWT
    //const token = "mock_jwt_token"; 
    res.status(201).json({ token, user: { name, email, role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // logic: Find user, compare password, generate JWT
    const token = "mock_jwt_token";
    res.json({ token, user: { name: "John Doe", email, role: "seeker" } });
  } catch (error) {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

router.get('/me', authMiddleware, getMe);
export default router;