// CHANGE THIS LINE:
import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ 
        success: false,
        error: 'No authentication token, access denied' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false,
      error: 'Token is not valid' 
    });
  }
};

export const employerOnly = (req, res, next) => {
  if (req.user.role !== 'employer') {
    return res.status(403).json({ 
      success: false,
      error: 'Access denied. Employers only.' 
    });
  }
  next();
};

export const seekerOnly = (req, res, next) => {
  if (req.user.role !== 'seeker') {
    return res.status(403).json({ 
      success: false,
      error: 'Access denied. Job seekers only.' 
    });
  }
  next();
};