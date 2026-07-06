// ============================================================================
// AUTH MIDDLEWARE - JWT Token Verification & Role Authorization
// ============================================================================

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET;

// Verify JWT Token
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-Password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid token. User not found.' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token.', error: error.message });
  }
};

// Role-based Authorization
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.Role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Role '${req.user.Role}' is not authorized. Required: ${roles.join(', ')}`
      });
    }
    next();
  };
};

module.exports = { authMiddleware, authorize };
