import jwt from 'jsonwebtoken';
import db from '../config/database.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer token
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: { message: 'Access token required', status: 401 }
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await db('users').where({ id: decoded.userId }).first();
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: { message: 'User not found', status: 401 }
      });
    }

    // SECURELY attach user to request object
    // Destructure to separate the password hash from the rest of the user data
    const { password_hash, ...safeUser } = user;

    // Attach only the safe user data to the request object
    req.user = safeUser;

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid token', status: 401 }
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: { message: 'Token expired', status: 401 }
      });
    }

    next(error);
  }
};

export const requireRole = (requiredRole) => {
  const roleHierarchy = {
    student: 0,
    clubAdmin: 1,
    superAdmin: 2,
  };

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Authentication required', status: 401 }
      });
    }

    const userLevel = roleHierarchy[req.user.role];
    const requiredLevel = roleHierarchy[requiredRole];

    if (userLevel < requiredLevel) {
      return res.status(403).json({
        success: false,
        error: { message: 'Insufficient permissions', status: 403 }
      });
    }

    next();
  };
};