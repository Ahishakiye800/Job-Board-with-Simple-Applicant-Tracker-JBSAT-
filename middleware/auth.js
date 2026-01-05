// middleware/auth.js
import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ success: false, error: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'development_secret');
    req.user = decoded; // This attaches the user id and role to the request
    next();
  } catch (err) {
    res.status(401).json({ success: false, error: 'Token is not valid' });
  }
};


export const employerOnly = (req, res, next) => {
  if (req.user && req.user.role === 'employer') {
    next();
  } else {
    res.status(403).json({ success: false, error: 'Access denied. Employers only.' });
  }
};


export const seekerOnly = (req, res, next) => {
  if (req.user && req.user.role === 'seeker') {
    next();
  } else {
    res.status(403).json({ success: false, error: 'Access denied. Seekers only.' });
  }
};