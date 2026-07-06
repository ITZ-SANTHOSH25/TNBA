// ============================================================================
// UTILITY FUNCTIONS - Standard API Response & Error Handling
// ============================================================================

// Standard API Response
const apiResponse = (res, success, message, data = null, statusCode = 200) => {
  return res.status(statusCode).json({ success, message, data });
};

// Error Handler
const handleError = (res, error, message = 'Server Error', statusCode = 500) => {
  console.error(`❌ Error: ${error.message}`);
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return res.status(400).json({ success: false, message: `${field} already exists.`, error: error.message });
  }
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map(val => val.message);
    return res.status(400).json({ success: false, message: 'Validation Error', errors: messages });
  }
  return res.status(statusCode).json({ success: false, message, error: error.message });
};

// Generate JWT Token
const generateToken = (userId, role) => {
  const jwt = require('jsonwebtoken');
  return jwt.sign({ id: userId, role: role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

module.exports = { apiResponse, handleError, generateToken };
