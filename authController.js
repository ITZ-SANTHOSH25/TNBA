// ============================================================================
// AUTH CONTROLLER - User Registration, Login & Profile
// ============================================================================

const User = require('../models/User');
const { apiResponse, handleError, generateToken } = require('../utils/helpers');

// POST /register - Register a new user
const register = async (req, res) => {
  try {
    const { Name, Email, Mobile, Password, Role } = req.body;
    if (!Name || !Email || !Mobile || !Password) {
      return apiResponse(res, false, 'Please provide Name, Email, Mobile, and Password', null, 400);
    }
    const existingUser = await User.findOne({ Email });
    if (existingUser) {
      return apiResponse(res, false, 'Email already registered', null, 400);
    }
    const user = await User.create({ Name, Email, Mobile, Password, Role: Role ? Role : 'Donor' });
    const token = generateToken(user._id, user.Role);
    const userData = { _id: user._id, Name: user.Name, Email: user.Email, Mobile: user.Mobile, Role: user.Role };
    return apiResponse(res, true, 'User registered successfully', { user: userData, token }, 201);
  } catch (error) {
    return handleError(res, error, 'Registration failed');
  }
};

// POST /login - Login user
const login = async (req, res) => {
  try {
    const { Email, Password } = req.body;
    if (!Email || !Password) {
      return apiResponse(res, false, 'Please provide Email and Password', null, 400);
    }
    const user = await User.findOne({ Email });
    if (!user) {
      return apiResponse(res, false, 'Invalid email or password', null, 401);
    }
    const isMatch = await user.comparePassword(Password);
    if (!isMatch) {
      return apiResponse(res, false, 'Invalid email or password', null, 401);
    }
    const token = generateToken(user._id, user.Role);
    const userData = { _id: user._id, Name: user.Name, Email: user.Email, Mobile: user.Mobile, Role: user.Role };
    return apiResponse(res, true, 'Login successful', { user: userData, token });
  } catch (error) {
    return handleError(res, error, 'Login failed');
  }
};

// GET /me - Get current user profile
const getProfile = async (req, res) => {
  try {
    return apiResponse(res, true, 'User profile fetched', req.user);
  } catch (error) {
    return handleError(res, error, 'Failed to fetch profile');
  }
};

module.exports = { register, login, getProfile };
