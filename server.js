// ============================================================================
// TAMIL NADU BLOOD BANK MANAGEMENT SYSTEM - Backend Server
// ============================================================================
// Technologies: Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt, CORS, dotenv
// ============================================================================

// ======================== ENVIRONMENT CONFIGURATION ========================
// All env variables are defined here — no separate .env file needed.
// To override, set environment variables before running the server.
// ============================================================================

process.env.PORT = process.env.PORT || '5000';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/tn_bloodbank';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'tnbbms_super_secret_key_2024_production';
process.env.BCRYPT_SALT_ROUNDS = process.env.BCRYPT_SALT_ROUNDS || '10';

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();

// ======================== MIDDLEWARE ========================
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;
const NODE_ENV = process.env.NODE_ENV;
const JWT_SECRET = process.env.JWT_SECRET;
const MONGO_URI = process.env.MONGO_URI;

// ======================== DATABASE CONNECTION ========================
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// ======================== MODELS ========================

// ---------- User Model ----------
const userSchema = new mongoose.Schema({
  Name: { type: String, required: true, trim: true },
  Email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  Mobile: { type: String, required: true, trim: true },
  Password: { type: String, required: true, minlength: 6 },
  Role: { type: String, enum: ['Admin', 'Hospital', 'BloodBank', 'Donor'], default: 'Donor' }
}, { timestamps: true });
userSchema.pre('save', async function(next) {
  if (!this.isModified('Password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.Password = await bcrypt.hash(this.Password, salt);
  next();
});
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.Password);
};
const User = mongoose.model('User', userSchema);

// ---------- Donor Model ----------
const donorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  Name: { type: String, required: true, trim: true },
  Email: { type: String, required: true, trim: true },
  Mobile: { type: String, required: true, trim: true },
  BloodGroup: { type: String, required: true, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
  Age: { type: Number, required: true, min: 18, max: 65 },
  Weight: { type: Number, required: true, min: 45 },
  LastDonationDate: { type: Date, default: null },
  Availability: { type: String, enum: ['Available', 'Unavailable', 'Deferred'], default: 'Available' },
  Address: { type: String, trim: true, default: '' }
}, { timestamps: true });
const Donor = mongoose.model('Donor', donorSchema);

// ---------- BloodBank Model ----------
const bloodBankSchema = new mongoose.Schema({
  Name: { type: String, required: true, trim: true },
  District: { type: String, required: true, trim: true },
  Contact: { type: String, required: true, trim: true },
  BloodStock: {
    'A+': { type: Number, default: 0, min: 0 },
    'A-': { type: Number, default: 0, min: 0 },
    'B+': { type: Number, default: 0, min: 0 },
    'B-': { type: Number, default: 0, min: 0 },
    'AB+': { type: Number, default: 0, min: 0 },
    'AB-': { type: Number, default: 0, min: 0 },
    'O+': { type: Number, default: 0, min: 0 },
    'O-': { type: Number, default: 0, min: 0 }
  },
  Location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });
bloodBankSchema.index({ Location: '2dsphere' });
const BloodBank = mongoose.model('BloodBank', bloodBankSchema);

// ---------- Hospital Model ----------
const hospitalSchema = new mongoose.Schema({
  Name: { type: String, required: true, trim: true },
  Address: { type: String, required: true, trim: true },
  Contact: { type: String, required: true, trim: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });
const Hospital = mongoose.model('Hospital', hospitalSchema);

// ---------- BloodRequest Model ----------
const bloodRequestSchema = new mongoose.Schema({
  PatientName: { type: String, required: true, trim: true },
  Hospital: { type: String, required: true, trim: true },
  BloodGroup: { type: String, required: true, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
  UnitsRequired: { type: Number, required: true, min: 1 },
  Status: { type: String, enum: ['Pending', 'Approved', 'Fulfilled', 'Rejected', 'Cancelled'], default: 'Pending' },
  RequestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  Urgency: { type: String, enum: ['Normal', 'Urgent', 'Critical'], default: 'Normal' }
}, { timestamps: true });
const BloodRequest = mongoose.model('BloodRequest', bloodRequestSchema);

// ---------- DonationCamp Model ----------
const donationCampSchema = new mongoose.Schema({
  CampName: { type: String, required: true, trim: true },
  Date: { type: Date, required: true },
  Time: { type: String, required: true, trim: true },
  Venue: { type: String, required: true, trim: true },
  Organizer: { type: String, required: true, trim: true },
  CreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });
const DonationCamp = mongoose.model('DonationCamp', donationCampSchema);

// ---------- Notification Model ----------
const notificationSchema = new mongoose.Schema({
  Title: { type: String, required: true, trim: true },
  Description: { type: String, required: true, trim: true },
  Date: { type: Date, default: Date.now },
  CreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });
const Notification = mongoose.model('Notification', notificationSchema);

// ---------- Feedback Model ----------
const feedbackSchema = new mongoose.Schema({
  Name: { type: String, required: true, trim: true },
  Rating: { type: Number, required: true, min: 1, max: 5 },
  Message: { type: String, required: true, trim: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });
const Feedback = mongoose.model('Feedback', feedbackSchema);

// ======================== MIDDLEWARE ========================

// Generate JWT Token
const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role: role }, JWT_SECRET, { expiresIn: '7d' });
};

// Auth Middleware - Verify JWT Token
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

// Role-based Authorization Middleware
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

// ======================== UTILITY FUNCTIONS ========================

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

// ======================== AUTH ROUTES ========================

// POST /register - Register a new user
app.post('/register', async (req, res) => {
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
});

// POST /login - Login user
app.post('/login', async (req, res) => {
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
});

// GET /me - Get current user profile
app.get('/me', authMiddleware, async (req, res) => {
  try {
    return apiResponse(res, true, 'User profile fetched', req.user);
  } catch (error) {
    return handleError(res, error, 'Failed to fetch profile');
  }
});

// ======================== DONOR ROUTES ========================

// GET /donors - Get all donors
app.get('/donors', authMiddleware, async (req, res) => {
  try {
    const { bloodGroup, availability, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (bloodGroup) filter.BloodGroup = bloodGroup;
    if (availability) filter.Availability = availability;
    const donors = await Donor.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    const total = await Donor.countDocuments(filter);
    return apiResponse(res, true, 'Donors fetched successfully', {
      donors, total, page: parseInt(page), pages: Math.ceil(total / limit)
    });
  } catch (error) {
    return handleError(res, error, 'Failed to fetch donors');
  }
});

// GET /donors/:id - Get single donor
app.get('/donors/:id', authMiddleware, async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);
    if (!donor) return apiResponse(res, false, 'Donor not found', null, 404);
    return apiResponse(res, true, 'Donor fetched successfully', donor);
  } catch (error) {
    return handleError(res, error, 'Failed to fetch donor');
  }
});

// POST /donor/register - Register as a donor
app.post('/donor/register', authMiddleware, async (req, res) => {
  try {
    const { BloodGroup, Age, Weight, LastDonationDate, Availability, Address } = req.body;
    const existingDonor = await Donor.findOne({ userId: req.user._id });
    if (existingDonor) {
      return apiResponse(res, false, 'You are already registered as a donor', null, 400);
    }
    const donor = await Donor.create({
      userId: req.user._id,
      Name: req.user.Name,
      Email: req.user.Email,
      Mobile: req.user.Mobile,
      BloodGroup, Age, Weight, LastDonationDate, Availability: Availability || 'Available', Address
    });
    return apiResponse(res, true, 'Donor registered successfully', donor, 201);
  } catch (error) {
    return handleError(res, error, 'Donor registration failed');
  }
});

// PUT /donor/update - Update donor profile
app.put('/donor/update', authMiddleware, async (req, res) => {
  try {
    const { BloodGroup, Age, Weight, LastDonationDate, Availability, Address } = req.body;
    const donor = await Donor.findOneAndUpdate(
      { userId: req.user._id },
      { BloodGroup, Age, Weight, LastDonationDate, Availability, Address },
      { new: true, runValidators: true }
    );
    if (!donor) return apiResponse(res, false, 'Donor profile not found', null, 404);
    return apiResponse(res, true, 'Donor profile updated successfully', donor);
  } catch (error) {
    return handleError(res, error, 'Donor update failed');
  }
});

// DELETE /donor/delete - Delete donor profile
app.delete('/donor/delete', authMiddleware, async (req, res) => {
  try {
    const donor = await Donor.findOneAndDelete({ userId: req.user._id });
    if (!donor) return apiResponse(res, false, 'Donor profile not found', null, 404);
    return apiResponse(res, true, 'Donor profile deleted successfully', donor);
  } catch (error) {
    return handleError(res, error, 'Donor deletion failed');
  }
});

// ======================== BLOOD BANK ROUTES ========================

// GET /bloodbanks - Get all blood banks
app.get('/bloodbanks', authMiddleware, async (req, res) => {
  try {
    const { district, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (district) filter.District = { $regex: district, $options: 'i' };
    const bloodbanks = await BloodBank.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    const total = await BloodBank.countDocuments(filter);
    return apiResponse(res, true, 'Blood banks fetched successfully', {
      bloodbanks, total, page: parseInt(page), pages: Math.ceil(total / limit)
    });
  } catch (error) {
    return handleError(res, error, 'Failed to fetch blood banks');
  }
});

// GET /bloodbanks/:id - Get single blood bank
app.get('/bloodbanks/:id', authMiddleware, async (req, res) => {
  try {
    const bloodbank = await BloodBank.findById(req.params.id);
    if (!bloodbank) return apiResponse(res, false, 'Blood bank not found', null, 404);
    return apiResponse(res, true, 'Blood bank fetched successfully', bloodbank);
  } catch (error) {
    return handleError(res, error, 'Failed to fetch blood bank');
  }
});

// POST /bloodbanks - Create a blood bank (Admin/BloodBank role)
app.post('/bloodbanks', authMiddleware, authorize('Admin', 'BloodBank'), async (req, res) => {
  try {
    const { Name, District, Contact, BloodStock, Location } = req.body;
    if (!Name || !District || !Contact) {
      return apiResponse(res, false, 'Please provide Name, District, and Contact', null, 400);
    }
    const bloodbank = await BloodBank.create({
      Name, District, Contact,
      BloodStock: BloodStock || { 'A+': 0, 'A-': 0, 'B+': 0, 'B-': 0, 'AB+': 0, 'AB-': 0, 'O+': 0, 'O-': 0 },
      Location: Location || { type: 'Point', coordinates: [0, 0] },
      userId: req.user._id
    });
    return apiResponse(res, true, 'Blood bank created successfully', bloodbank, 201);
  } catch (error) {
    return handleError(res, error, 'Blood bank creation failed');
  }
});

// PUT /bloodbanks/:id - Update a blood bank (Admin/BloodBank role)
app.put('/bloodbanks/:id', authMiddleware, authorize('Admin', 'BloodBank'), async (req, res) => {
  try {
    const { Name, District, Contact, BloodStock, Location } = req.body;
    const bloodbank = await BloodBank.findByIdAndUpdate(
      req.params.id,
      { Name, District, Contact, BloodStock, Location },
      { new: true, runValidators: true }
    );
    if (!bloodbank) return apiResponse(res, false, 'Blood bank not found', null, 404);
    return apiResponse(res, true, 'Blood bank updated successfully', bloodbank);
  } catch (error) {
    return handleError(res, error, 'Blood bank update failed');
  }
});

// DELETE /bloodbanks/:id - Delete a blood bank (Admin only)
app.delete('/bloodbanks/:id', authMiddleware, authorize('Admin'), async (req, res) => {
  try {
    const bloodbank = await BloodBank.findByIdAndDelete(req.params.id);
    if (!bloodbank) return apiResponse(res, false, 'Blood bank not found', null, 404);
    return apiResponse(res, true, 'Blood bank deleted successfully', bloodbank);
  } catch (error) {
    return handleError(res, error, 'Blood bank deletion failed');
  }
});

// ======================== BLOOD AVAILABILITY & SEARCH ========================

// GET /blood/search?group=A+ - Search blood availability across all blood banks
app.get('/blood/search', authMiddleware, async (req, res) => {
  try {
    const { group } = req.query;
    if (!group) {
      return apiResponse(res, false, 'Please provide a blood group parameter (e.g., ?group=A+)', null, 400);
    }
    const validGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    if (!validGroups.includes(group)) {
      return apiResponse(res, false, `Invalid blood group. Valid groups: ${validGroups.join(', ')}`, null, 400);
    }
    const bloodbanks = await BloodBank.find({ [`BloodStock.${group}`]: { $gt: 0 } });
    const totalUnits = bloodbanks.reduce((sum, bb) => sum + (bb.BloodStock[group] || 0), 0);
    return apiResponse(res, true, `Blood availability for ${group}`, {
      bloodGroup: group,
      totalUnits,
      availableBanks: bloodbanks.map(bb => ({
        _id: bb._id,
        Name: bb.Name,
        District: bb.District,
        Contact: bb.Contact,
        AvailableUnits: bb.BloodStock[group]
      }))
    });
  } catch (error) {
    return handleError(res, error, 'Blood search failed');
  }
});

// ======================== BLOOD REQUEST ROUTES ========================

// POST /blood/request - Create an emergency blood request
app.post('/blood/request', authMiddleware, authorize('Hospital', 'Admin'), async (req, res) => {
  try {
    const { PatientName, Hospital, BloodGroup, UnitsRequired, Urgency } = req.body;
    if (!PatientName || !Hospital || !BloodGroup || !UnitsRequired) {
      return apiResponse(res, false, 'Please provide PatientName, Hospital, BloodGroup, and UnitsRequired', null, 400);
    }
    const bloodRequest = await BloodRequest.create({
      PatientName, Hospital, BloodGroup, UnitsRequired,
      Urgency: Urgency || 'Normal',
      RequestedBy: req.user._id
    });
    return apiResponse(res, true, 'Blood request created successfully', bloodRequest, 201);
  } catch (error) {
    return handleError(res, error, 'Blood request creation failed');
  }
});

// GET /blood/request - Get all blood requests
app.get('/blood/request', authMiddleware, async (req, res) => {
  try {
    const { status, bloodGroup, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (status) filter.Status = status;
    if (bloodGroup) filter.BloodGroup = bloodGroup;
    if (req.user.Role === 'Hospital') filter.RequestedBy = req.user._id;
    const requests = await BloodRequest.find(filter)
      .populate('RequestedBy', 'Name Email Mobile Role')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    const total = await BloodRequest.countDocuments(filter);
    return apiResponse(res, true, 'Blood requests fetched successfully', {
      requests, total, page: parseInt(page), pages: Math.ceil(total / limit)
    });
  } catch (error) {
    return handleError(res, error, 'Failed to fetch blood requests');
  }
});

// GET /blood/request/:id - Get single blood request
app.get('/blood/request/:id', authMiddleware, async (req, res) => {
  try {
    const bloodRequest = await BloodRequest.findById(req.params.id).populate('RequestedBy', 'Name Email Mobile Role');
    if (!bloodRequest) return apiResponse(res, false, 'Blood request not found', null, 404);
    return apiResponse(res, true, 'Blood request fetched successfully', bloodRequest);
  } catch (error) {
    return handleError(res, error, 'Failed to fetch blood request');
  }
});

// PUT /blood/request/:id - Update blood request status (Admin/BloodBank)
app.put('/blood/request/:id', authMiddleware, authorize('Admin', 'BloodBank'), async (req, res) => {
  try {
    const { Status } = req.body;
    if (!['Approved', 'Fulfilled', 'Rejected', 'Cancelled'].includes(Status)) {
      return apiResponse(res, false, 'Invalid status. Valid: Approved, Fulfilled, Rejected, Cancelled', null, 400);
    }
    const bloodRequest = await BloodRequest.findByIdAndUpdate(
      req.params.id, { Status }, { new: true, runValidators: true }
    ).populate('RequestedBy', 'Name Email Mobile Role');
    if (!bloodRequest) return apiResponse(res, false, 'Blood request not found', null, 404);
    return apiResponse(res, true, 'Blood request status updated', bloodRequest);
  } catch (error) {
    return handleError(res, error, 'Blood request update failed');
  }
});

// ======================== HOSPITAL ROUTES ========================

// GET /hospitals - Get all hospitals
app.get('/hospitals', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const hospitals = await Hospital.find()
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    const total = await Hospital.countDocuments();
    return apiResponse(res, true, 'Hospitals fetched successfully', {
      hospitals, total, page: parseInt(page), pages: Math.ceil(total / limit)
    });
  } catch (error) {
    return handleError(res, error, 'Failed to fetch hospitals');
  }
});

// POST /hospitals - Register a hospital (Admin only)
app.post('/hospitals', authMiddleware, authorize('Admin'), async (req, res) => {
  try {
    const { Name, Address, Contact, Email, Password, Mobile } = req.body;
    if (!Name || !Address || !Contact || !Email || !Password || !Mobile) {
      return apiResponse(res, false, 'Please provide Name, Address, Contact, Email, Mobile, and Password', null, 400);
    }
    const user = await User.create({ Name, Email, Mobile, Password, Role: 'Hospital' });
    const hospital = await Hospital.create({ Name, Address, Contact, userId: user._id });
    return apiResponse(res, true, 'Hospital registered successfully', hospital, 201);
  } catch (error) {
    return handleError(res, error, 'Hospital registration failed');
  }
});

// PUT /hospitals/:id - Update hospital (Admin only)
app.put('/hospitals/:id', authMiddleware, authorize('Admin'), async (req, res) => {
  try {
    const { Name, Address, Contact } = req.body;
    const hospital = await Hospital.findByIdAndUpdate(
      req.params.id, { Name, Address, Contact }, { new: true, runValidators: true }
    );
    if (!hospital) return apiResponse(res, false, 'Hospital not found', null, 404);
    return apiResponse(res, true, 'Hospital updated successfully', hospital);
  } catch (error) {
    return handleError(res, error, 'Hospital update failed');
  }
});

// DELETE /hospitals/:id - Delete hospital (Admin only)
app.delete('/hospitals/:id', authMiddleware, authorize('Admin'), async (req, res) => {
  try {
    const hospital = await Hospital.findByIdAndDelete(req.params.id);
    if (!hospital) return apiResponse(res, false, 'Hospital not found', null, 404);
    if (hospital.userId) await User.findByIdAndDelete(hospital.userId);
    return apiResponse(res, true, 'Hospital deleted successfully', hospital);
  } catch (error) {
    return handleError(res, error, 'Hospital deletion failed');
  }
});

// ======================== DONATION CAMP ROUTES ========================

// GET /camps - Get all donation camps
app.get('/camps', authMiddleware, async (req, res) => {
  try {
    const { upcoming, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (upcoming === 'true') filter.Date = { $gte: new Date() };
    const camps = await DonationCamp.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ Date: 1 });
    const total = await DonationCamp.countDocuments(filter);
    return apiResponse(res, true, 'Donation camps fetched successfully', {
      camps, total, page: parseInt(page), pages: Math.ceil(total / limit)
    });
  } catch (error) {
    return handleError(res, error, 'Failed to fetch donation camps');
  }
});

// GET /camps/:id - Get single camp
app.get('/camps/:id', authMiddleware, async (req, res) => {
  try {
    const camp = await DonationCamp.findById(req.params.id);
    if (!camp) return apiResponse(res, false, 'Donation camp not found', null, 404);
    return apiResponse(res, true, 'Donation camp fetched successfully', camp);
  } catch (error) {
    return handleError(res, error, 'Failed to fetch donation camp');
  }
});

// POST /camps - Create a donation camp (Admin/BloodBank only)
app.post('/camps', authMiddleware, authorize('Admin', 'BloodBank'), async (req, res) => {
  try {
    const { CampName, Date, Time, Venue, Organizer } = req.body;
    if (!CampName || !Date || !Time || !Venue || !Organizer) {
      return apiResponse(res, false, 'Please provide CampName, Date, Time, Venue, and Organizer', null, 400);
    }
    const camp = await DonationCamp.create({
      CampName, Date, Time, Venue, Organizer, CreatedBy: req.user._id
    });
    return apiResponse(res, true, 'Donation camp created successfully', camp, 201);
  } catch (error) {
    return handleError(res, error, 'Donation camp creation failed');
  }
});

// PUT /camps/:id - Update a donation camp (Admin/BloodBank only)
app.put('/camps/:id', authMiddleware, authorize('Admin', 'BloodBank'), async (req, res) => {
  try {
    const { CampName, Date, Time, Venue, Organizer } = req.body;
    const camp = await DonationCamp.findByIdAndUpdate(
      req.params.id, { CampName, Date, Time, Venue, Organizer }, { new: true, runValidators: true }
    );
    if (!camp) return apiResponse(res, false, 'Donation camp not found', null, 404);
    return apiResponse(res, true, 'Donation camp updated successfully', camp);
  } catch (error) {
    return handleError(res, error, 'Donation camp update failed');
  }
});

// DELETE /camps/:id - Delete a donation camp (Admin only)
app.delete('/camps/:id', authMiddleware, authorize('Admin'), async (req, res) => {
  try {
    const camp = await DonationCamp.findByIdAndDelete(req.params.id);
    if (!camp) return apiResponse(res, false, 'Donation camp not found', null, 404);
    return apiResponse(res, true, 'Donation camp deleted successfully', camp);
  } catch (error) {
    return handleError(res, error, 'Donation camp deletion failed');
  }
});

// ======================== ADMIN ROUTES ========================

// GET /admin/dashboard - Dashboard Statistics
app.get('/admin/dashboard', authMiddleware, authorize('Admin'), async (req, res) => {
  try {
    const totalDonors = await Donor.countDocuments();
    const totalBloodBanks = await BloodBank.countDocuments();
    const totalHospitals = await Hospital.countDocuments();
    const totalRequests = await BloodRequest.countDocuments();
    const pendingRequests = await BloodRequest.countDocuments({ Status: 'Pending' });
    const approvedRequests = await BloodRequest.countDocuments({ Status: 'Approved' });
    const fulfilledRequests = await BloodRequest.countDocuments({ Status: 'Fulfilled' });
    const totalCamps = await DonationCamp.countDocuments();
    const upcomingCamps = await DonationCamp.countDocuments({ Date: { $gte: new Date() } });

    // Aggregate total blood stock across all banks
    const stockAggregation = await BloodBank.aggregate([
      { $group: {
        _id: null,
        'A+': { $sum: '$BloodStock.A+' },
        'A-': { $sum: '$BloodStock.A-' },
        'B+': { $sum: '$BloodStock.B+' },
        'B-': { $sum: '$BloodStock.B-' },
        'AB+': { $sum: '$BloodStock.AB+' },
        'AB-': { $sum: '$BloodStock.AB-' },
        'O+': { $sum: '$BloodStock.O+' },
        'O-': { $sum: '$BloodStock.O-' }
      }}
    ]);
    const bloodStock = stockAggregation[0] || { 'A+': 0, 'A-': 0, 'B+': 0, 'B-': 0, 'AB+': 0, 'AB-': 0, 'O+': 0, 'O-': 0 };
    delete bloodStock._id;
    const totalAvailableUnits = Object.values(bloodStock).reduce((sum, val) => sum + val, 0);

    // Donor count by blood group
    const donorsByGroup = await Donor.aggregate([
      { $group: { _id: '$BloodGroup', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    return apiResponse(res, true, 'Dashboard statistics fetched', {
      totalDonors,
      totalBloodBanks,
      totalHospitals,
      totalAvailableUnits,
      bloodStock,
      totalRequests,
      pendingRequests,
      approvedRequests,
      fulfilledRequests,
      totalCamps,
      upcomingCamps,
      donorsByGroup
    });
  } catch (error) {
    return handleError(res, error, 'Failed to fetch dashboard statistics');
  }
});

// ======================== NOTIFICATION ROUTES ========================

// GET /notifications - Get all notifications
app.get('/notifications', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const notifications = await Notification.find()
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ Date: -1 });
    const total = await Notification.countDocuments();
    return apiResponse(res, true, 'Notifications fetched successfully', {
      notifications, total, page: parseInt(page), pages: Math.ceil(total / limit)
    });
  } catch (error) {
    return handleError(res, error, 'Failed to fetch notifications');
  }
});

// POST /notifications - Create a notification (Admin only)
app.post('/notifications', authMiddleware, authorize('Admin'), async (req, res) => {
  try {
    const { Title, Description } = req.body;
    if (!Title || !Description) {
      return apiResponse(res, false, 'Please provide Title and Description', null, 400);
    }
    const notification = await Notification.create({ Title, Description, CreatedBy: req.user._id });
    return apiResponse(res, true, 'Notification created successfully', notification, 201);
  } catch (error) {
    return handleError(res, error, 'Notification creation failed');
  }
});

// DELETE /notifications/:id - Delete notification (Admin only)
app.delete('/notifications/:id', authMiddleware, authorize('Admin'), async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) return apiResponse(res, false, 'Notification not found', null, 404);
    return apiResponse(res, true, 'Notification deleted successfully', notification);
  } catch (error) {
    return handleError(res, error, 'Notification deletion failed');
  }
});

// ======================== FEEDBACK ROUTES ========================

// GET /feedback - Get all feedback (Admin only)
app.get('/feedback', authMiddleware, authorize('Admin'), async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const feedbacks = await Feedback.find()
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    const total = await Feedback.countDocuments();
    const avgRating = await Feedback.aggregate([
      { $group: { _id: null, averageRating: { $avg: '$Rating' } } }
    ]);
    return apiResponse(res, true, 'Feedback fetched successfully', {
      feedbacks, total, averageRating: avgRating[0]?.averageRating?.toFixed(2) || 0,
      page: parseInt(page), pages: Math.ceil(total / limit)
    });
  } catch (error) {
    return handleError(res, error, 'Failed to fetch feedback');
  }
});

// POST /feedback - Submit feedback
app.post('/feedback', authMiddleware, async (req, res) => {
  try {
    const { Name, Rating, Message } = req.body;
    if (!Name || !Rating || !Message) {
      return apiResponse(res, false, 'Please provide Name, Rating (1-5), and Message', null, 400);
    }
    if (Rating < 1 || Rating > 5) {
      return apiResponse(res, false, 'Rating must be between 1 and 5', null, 400);
    }
    const feedback = await Feedback.create({ Name, Rating, Message, userId: req.user._id });
    return apiResponse(res, true, 'Feedback submitted successfully', feedback, 201);
  } catch (error) {
    return handleError(res, error, 'Feedback submission failed');
  }
});

// ======================== SEED DATABASE WITH DUMMY DATA ========================

const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('📦 Database already seeded. Skipping...');
      return;
    }

    console.log('🌱 Seeding database with dummy data...');

    // Create Admin User
    const adminUser = await User.create({
      Name: 'Admin TNBBMS', Email: 'admin@tnbbms.in', Mobile: '9876543210',
      Password: 'admin123', Role: 'Admin'
    });
    console.log('  ✅ Admin user created');

    // Create Blood Bank Users
    const bbUser1 = await User.create({
      Name: 'Chennai Blood Bank', Email: 'chennai.bb@tnbbms.in', Mobile: '9876543211',
      Password: 'bb123456', Role: 'BloodBank'
    });
    const bbUser2 = await User.create({
      Name: 'Coimbatore Blood Bank', Email: 'coimbatore.bb@tnbbms.in', Mobile: '9876543212',
      Password: 'bb123456', Role: 'BloodBank'
    });
    const bbUser3 = await User.create({
      Name: 'Madurai Blood Bank', Email: 'madurai.bb@tnbbms.in', Mobile: '9876543213',
      Password: 'bb123456', Role: 'BloodBank'
    });
    const bbUser4 = await User.create({
      Name: 'Salem Blood Bank', Email: 'salem.bb@tnbbms.in', Mobile: '9876543214',
      Password: 'bb123456', Role: 'BloodBank'
    });
    console.log('  ✅ Blood bank users created');

    // Create Hospital Users
    const hospUser1 = await User.create({
      Name: 'GH Chennai', Email: 'gh.chennai@tnbbms.in', Mobile: '9876543221',
      Password: 'hosp1234', Role: 'Hospital'
    });
    const hospUser2 = await User.create({
      Name: 'CMC Vellore', Email: 'cmc.vellore@tnbbms.in', Mobile: '9876543222',
      Password: 'hosp1234', Role: 'Hospital'
    });
    const hospUser3 = await User.create({
      Name: 'GH Madurai', Email: 'gh.madurai@tnbbms.in', Mobile: '9876543223',
      Password: 'hosp1234', Role: 'Hospital'
    });
    console.log('  ✅ Hospital users created');

    // Create Donor Users
    const donorUsers = [];
    const donorData = [
      { Name: 'Arun Kumar', Email: 'arun@gmail.com', Mobile: '9988776601' },
      { Name: 'Priya Ramesh', Email: 'priya@gmail.com', Mobile: '9988776602' },
      { Name: 'Suresh Babu', Email: 'suresh@gmail.com', Mobile: '9988776603' },
      { Name: 'Lakshmi Devi', Email: 'lakshmi@gmail.com', Mobile: '9988776604' },
      { Name: 'Karthik Rajan', Email: 'karthik@gmail.com', Mobile: '9988776605' },
      { Name: 'Meena Kumari', Email: 'meena@gmail.com', Mobile: '9988776606' },
      { Name: 'Vijay Prakash', Email: 'vijay@gmail.com', Mobile: '9988776607' },
      { Name: 'Anitha Selvam', Email: 'anitha@gmail.com', Mobile: '9988776608' },
      { Name: 'Rajesh Muthu', Email: 'rajesh@gmail.com', Mobile: '9988776609' },
      { Name: 'Deepa Narayanan', Email: 'deepa@gmail.com', Mobile: '9988776610' }
    ];
    for (const d of donorData) {
      const user = await User.create({ ...d, Password: 'donor123', Role: 'Donor' });
      donorUsers.push(user);
    }
    console.log('  ✅ Donor users created');

    // Create Donor Profiles
    const donorProfiles = [
      { BloodGroup: 'O+', Age: 28, Weight: 72, Availability: 'Available', Address: 'T. Nagar, Chennai' },
      { BloodGroup: 'A+', Age: 32, Weight: 65, Availability: 'Available', Address: 'RS Puram, Coimbatore' },
      { BloodGroup: 'B+', Age: 25, Weight: 68, Availability: 'Available', Address: 'Anna Nagar, Madurai' },
      { BloodGroup: 'O-', Age: 30, Weight: 58, Availability: 'Unavailable', Address: 'Salem Town, Salem', LastDonationDate: new Date('2024-11-15') },
      { BloodGroup: 'AB+', Age: 35, Weight: 75, Availability: 'Available', Address: 'Velachery, Chennai' },
      { BloodGroup: 'A-', Age: 27, Weight: 55, Availability: 'Available', Address: 'Gandhipuram, Coimbatore' },
      { BloodGroup: 'B-', Age: 40, Weight: 70, Availability: 'Deferred', Address: 'KK Nagar, Madurai' },
      { BloodGroup: 'O+', Age: 22, Weight: 60, Availability: 'Available', Address: 'Besant Nagar, Chennai' },
      { BloodGroup: 'AB-', Age: 33, Weight: 80, Availability: 'Available', Address: 'Five Roads, Salem' },
      { BloodGroup: 'A+', Age: 29, Weight: 62, Availability: 'Available', Address: 'Adyar, Chennai' }
    ];
    for (let i = 0; i < donorUsers.length; i++) {
      await Donor.create({
        userId: donorUsers[i]._id, Name: donorUsers[i].Name, Email: donorUsers[i].Email,
        Mobile: donorUsers[i].Mobile, ...donorProfiles[i]
      });
    }
    console.log('  ✅ Donor profiles created');

    // Create Blood Banks
    await BloodBank.create({
      Name: 'Chennai Government Blood Bank', District: 'Chennai', Contact: '044-28765501',
      BloodStock: { 'A+': 45, 'A-': 12, 'B+': 38, 'B-': 8, 'AB+': 20, 'AB-': 5, 'O+': 55, 'O-': 10 },
      Location: { type: 'Point', coordinates: [80.2785, 13.0827] }, userId: bbUser1._id
    });
    await BloodBank.create({
      Name: 'Coimbatore District Blood Bank', District: 'Coimbatore', Contact: '0422-2308650',
      BloodStock: { 'A+': 30, 'A-': 10, 'B+': 25, 'B-': 6, 'AB+': 15, 'AB-': 3, 'O+': 40, 'O-': 8 },
      Location: { type: 'Point', coordinates: [76.9558, 11.0168] }, userId: bbUser2._id
    });
    await BloodBank.create({
      Name: 'Madurai Central Blood Bank', District: 'Madurai', Contact: '0452-2341560',
      BloodStock: { 'A+': 22, 'A-': 7, 'B+': 18, 'B-': 4, 'AB+': 12, 'AB-': 2, 'O+': 30, 'O-': 5 },
      Location: { type: 'Point', coordinates: [78.1198, 9.9252] }, userId: bbUser3._id
    });
    await BloodBank.create({
      Name: 'Salem Blood Bank', District: 'Salem', Contact: '0427-2422550',
      BloodStock: { 'A+': 15, 'A-': 5, 'B+': 12, 'B-': 3, 'AB+': 8, 'AB-': 1, 'O+': 20, 'O-': 4 },
      Location: { type: 'Point', coordinates: [78.1583, 11.6643] }, userId: bbUser4._id
    });
    console.log('  ✅ Blood banks created');

    // Create Hospitals
    await Hospital.create({ Name: 'Government General Hospital', Address: 'Chennai, Tamil Nadu 600003', Contact: '044-25360500', userId: hospUser1._id });
    await Hospital.create({ Name: 'Christian Medical College', Address: 'Vellore, Tamil Nadu 632004', Contact: '0416-2281000', userId: hospUser2._id });
    await Hospital.create({ Name: 'Government Rajaji Hospital', Address: 'Madurai, Tamil Nadu 625020', Contact: '0452-2526661', userId: hospUser3._id });
    console.log('  ✅ Hospitals created');

    // Create Blood Requests
    await BloodRequest.create({
      PatientName: 'Ravi Shankar', Hospital: 'Government General Hospital, Chennai',
      BloodGroup: 'O-', UnitsRequired: 3, Urgency: 'Critical', RequestedBy: hospUser1._id, Status: 'Pending'
    });
    await BloodRequest.create({
      PatientName: 'Kavitha S', Hospital: 'Christian Medical College, Vellore',
      BloodGroup: 'A+', UnitsRequired: 2, Urgency: 'Urgent', RequestedBy: hospUser2._id, Status: 'Approved'
    });
    await BloodRequest.create({
      PatientName: 'Murugan P', Hospital: 'Government Rajaji Hospital, Madurai',
      BloodGroup: 'B+', UnitsRequired: 1, Urgency: 'Normal', RequestedBy: hospUser3._id, Status: 'Fulfilled'
    });
    await BloodRequest.create({
      PatientName: 'Selvi K', Hospital: 'Government General Hospital, Chennai',
      BloodGroup: 'AB-', UnitsRequired: 2, Urgency: 'Critical', RequestedBy: hospUser1._id, Status: 'Pending'
    });
    await BloodRequest.create({
      PatientName: 'Thangavel R', Hospital: 'Christian Medical College, Vellore',
      BloodGroup: 'O+', UnitsRequired: 4, Urgency: 'Urgent', RequestedBy: hospUser2._id, Status: 'Pending'
    });
    console.log('  ✅ Blood requests created');

    // Create Donation Camps
    await DonationCamp.create({
      CampName: 'Chennai Mega Blood Donation Drive', Date: new Date('2025-02-15'),
      Time: '09:00 AM - 05:00 PM', Venue: 'Chennai Trade Centre, Nandambakkam', Organizer: 'Tamil Nadu Red Cross Society', CreatedBy: adminUser._id
    });
    await DonationCamp.create({
      CampName: 'Coimbatore Youth Blood Camp', Date: new Date('2025-03-01'),
      Time: '08:00 AM - 04:00 PM', Venue: 'CODISSIA Trade Fair Complex, Coimbatore', Organizer: 'Rotary Club of Coimbatore', CreatedBy: bbUser2._id
    });
    await DonationCamp.create({
      CampName: 'Madurai Temple City Blood Drive', Date: new Date('2025-03-15'),
      Time: '10:00 AM - 03:00 PM', Venue: 'Madurai Corporation Ground', Organizer: 'Lions Club Madurai', CreatedBy: bbUser3._id
    });
    await DonationCamp.create({
      CampName: 'Salem Voluntary Blood Donation Camp', Date: new Date('2025-01-10'),
      Time: '09:00 AM - 01:00 PM', Venue: 'Salem GH Campus', Organizer: 'Salem Doctors Association', CreatedBy: bbUser4._id
    });
    console.log('  ✅ Donation camps created');

    // Create Notifications
    await Notification.create({ Title: 'Urgent: O- Blood Needed', Description: 'Critical shortage of O-negative blood across Tamil Nadu. All eligible donors are requested to donate immediately.', CreatedBy: adminUser._id });
    await Notification.create({ Title: 'New Donation Camp in Chennai', Description: 'A mega blood donation drive is being organized at Chennai Trade Centre on February 15, 2025. Register now!', CreatedBy: adminUser._id });
    await Notification.create({ Title: 'World Blood Donor Day', Description: 'Celebrate World Blood Donor Day on June 14. Participate in events across Tamil Nadu and help save lives.', CreatedBy: adminUser._id });
    await Notification.create({ Title: 'System Maintenance Notice', Description: 'The TNBBMS portal will undergo scheduled maintenance on Jan 20, 2025, from 2 AM to 5 AM IST.', CreatedBy: adminUser._id });
    console.log('  ✅ Notifications created');

    // Create Feedback
    await Feedback.create({ Name: 'Arun Kumar', Rating: 5, Message: 'Excellent platform! Very easy to find blood availability. Saved my uncle\'s life with quick O- blood search.', userId: donorUsers[0]._id });
    await Feedback.create({ Name: 'Priya Ramesh', Rating: 4, Message: 'Great initiative by Tamil Nadu government. The donation camp registration process is smooth and efficient.', userId: donorUsers[1]._id });
    await Feedback.create({ Name: 'Dr. Senthil', Rating: 5, Message: 'As a hospital administrator, this system has streamlined our blood request process significantly. Highly recommended.', userId: hospUser1._id });
    await Feedback.create({ Name: 'Rajesh Muthu', Rating: 3, Message: 'Good system but would like to see real-time blood stock updates. Sometimes the stock numbers seem outdated.', userId: donorUsers[8]._id });
    await Feedback.create({ Name: 'Deepa Narayanan', Rating: 4, Message: 'The notification feature is very helpful. I got alerted about a camp near me and was able to donate blood.', userId: donorUsers[9]._id });
    console.log('  ✅ Feedback created');

    console.log('\n🎉 Database seeded successfully with dummy data!\n');
    console.log('═══════════════════════════════════════════════════');
    console.log('  TEST CREDENTIALS:');
    console.log('═══════════════════════════════════════════════════');
    console.log('  🔑 Admin      → admin@tnbbms.in  / admin123');
    console.log('  🔑 Blood Bank  → chennai.bb@tnbbms.in  / bb123456');
    console.log('  🔑 Hospital    → gh.chennai@tnbbms.in  / hosp1234');
    console.log('  🔑 Donor       → arun@gmail.com  / donor123');
    console.log('═══════════════════════════════════════════════════\n');
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
  }
};

// ======================== API DOCUMENTATION ROUTE ========================

app.get('/api-docs', (req, res) => {
  const docs = {
    projectName: 'Tamil Nadu Blood Bank Management System (TNBBMS)',
    version: '1.0.0',
    baseUrl: 'http://localhost:' + PORT,
    authentication: {
      type: 'Bearer Token (JWT)',
      header: 'Authorization: Bearer <token>',
      tokenExpiry: '7 days',
      note: 'Login or Register to obtain a token. Include it in the Authorization header for all protected routes.'
    },
    testCredentials: {
      Admin: { email: 'admin@tnbbms.in', password: 'admin123' },
      BloodBank: { email: 'chennai.bb@tnbbms.in', password: 'bb123456' },
      Hospital: { email: 'gh.chennai@tnbbms.in', password: 'hosp1234' },
      Donor: { email: 'arun@gmail.com', password: 'donor123' }
    },
    endpoints: {
      authentication: {
        'POST /register': {
          description: 'Register a new user',
          access: 'Public',
          body: { Name: 'string', Email: 'string', Mobile: 'string', Password: 'string (min 6)', Role: 'Admin | Hospital | BloodBank | Donor (default: Donor)' },
          response: '{ success, message, data: { user, token } }'
        },
        'POST /login': {
          description: 'Login user and get JWT token',
          access: 'Public',
          body: { Email: 'string', Password: 'string' },
          response: '{ success, message, data: { user, token } }'
        },
        'GET /me': {
          description: 'Get current user profile',
          access: 'Authenticated',
          response: '{ success, message, data: user }'
        }
      },
      donorAPIs: {
        'GET /donors': {
          description: 'Get all donors (with pagination & filters)',
          access: 'Authenticated',
          query: { bloodGroup: 'A+ | A- | B+ | B- | AB+ | AB- | O+ | O-', availability: 'Available | Unavailable | Deferred', page: 'number', limit: 'number' },
          response: '{ success, message, data: { donors, total, page, pages } }'
        },
        'GET /donors/:id': {
          description: 'Get single donor by ID',
          access: 'Authenticated',
          response: '{ success, message, data: donor }'
        },
        'POST /donor/register': {
          description: 'Register as a donor (one per user)',
          access: 'Authenticated',
          body: { BloodGroup: 'A+ | A- | B+ | B- | AB+ | AB- | O+ | O-', Age: 'number (18-65)', Weight: 'number (min 45)', LastDonationDate: 'Date', Availability: 'Available | Unavailable | Deferred', Address: 'string' },
          response: '{ success, message, data: donor }'
        },
        'PUT /donor/update': {
          description: 'Update own donor profile',
          access: 'Authenticated (Donor)',
          body: { BloodGroup: 'string', Age: 'number', Weight: 'number', LastDonationDate: 'Date', Availability: 'string', Address: 'string' },
          response: '{ success, message, data: donor }'
        },
        'DELETE /donor/delete': {
          description: 'Delete own donor profile',
          access: 'Authenticated (Donor)',
          response: '{ success, message, data: donor }'
        }
      },
      bloodBankAPIs: {
        'GET /bloodbanks': {
          description: 'Get all blood banks (with pagination & district filter)',
          access: 'Authenticated',
          query: { district: 'string', page: 'number', limit: 'number' },
          response: '{ success, message, data: { bloodbanks, total, page, pages } }'
        },
        'GET /bloodbanks/:id': {
          description: 'Get single blood bank by ID',
          access: 'Authenticated',
          response: '{ success, message, data: bloodbank }'
        },
        'POST /bloodbanks': {
          description: 'Create a blood bank',
          access: 'Admin, BloodBank',
          body: { Name: 'string', District: 'string', Contact: 'string', BloodStock: 'object (A+, A-, B+, B-, AB+, AB-, O+, O-)', Location: '{ type: "Point", coordinates: [lng, lat] }' },
          response: '{ success, message, data: bloodbank }'
        },
        'PUT /bloodbanks/:id': {
          description: 'Update a blood bank',
          access: 'Admin, BloodBank',
          body: { Name: 'string', District: 'string', Contact: 'string', BloodStock: 'object', Location: 'object' },
          response: '{ success, message, data: bloodbank }'
        },
        'DELETE /bloodbanks/:id': {
          description: 'Delete a blood bank',
          access: 'Admin',
          response: '{ success, message, data: bloodbank }'
        }
      },
      bloodAvailability: {
        'GET /blood/search?group=A+': {
          description: 'Search blood availability across all blood banks by blood group',
          access: 'Authenticated',
          query: { group: 'A+ | A- | B+ | B- | AB+ | AB- | O+ | O-' },
          response: '{ success, message, data: { bloodGroup, totalUnits, availableBanks } }'
        }
      },
      bloodRequests: {
        'POST /blood/request': {
          description: 'Create an emergency blood request',
          access: 'Hospital, Admin',
          body: { PatientName: 'string', Hospital: 'string', BloodGroup: 'string', UnitsRequired: 'number', Urgency: 'Normal | Urgent | Critical' },
          response: '{ success, message, data: bloodRequest }'
        },
        'GET /blood/request': {
          description: 'Get all blood requests (Hospital sees own requests)',
          access: 'Authenticated',
          query: { status: 'Pending | Approved | Fulfilled | Rejected | Cancelled', bloodGroup: 'string', page: 'number', limit: 'number' },
          response: '{ success, message, data: { requests, total, page, pages } }'
        },
        'GET /blood/request/:id': {
          description: 'Get single blood request by ID',
          access: 'Authenticated',
          response: '{ success, message, data: bloodRequest }'
        },
        'PUT /blood/request/:id': {
          description: 'Update blood request status',
          access: 'Admin, BloodBank',
          body: { Status: 'Approved | Fulfilled | Rejected | Cancelled' },
          response: '{ success, message, data: bloodRequest }'
        }
      },
      hospitalAPIs: {
        'GET /hospitals': {
          description: 'Get all hospitals',
          access: 'Authenticated',
          query: { page: 'number', limit: 'number' },
          response: '{ success, message, data: { hospitals, total, page, pages } }'
        },
        'POST /hospitals': {
          description: 'Register a hospital',
          access: 'Admin',
          body: { Name: 'string', Address: 'string', Contact: 'string', Email: 'string', Password: 'string', Mobile: 'string' },
          response: '{ success, message, data: hospital }'
        },
        'PUT /hospitals/:id': {
          description: 'Update a hospital',
          access: 'Admin',
          body: { Name: 'string', Address: 'string', Contact: 'string' },
          response: '{ success, message, data: hospital }'
        },
        'DELETE /hospitals/:id': {
          description: 'Delete a hospital and its user account',
          access: 'Admin',
          response: '{ success, message, data: hospital }'
        }
      },
      donationCamps: {
        'GET /camps': {
          description: 'Get all donation camps',
          access: 'Authenticated',
          query: { upcoming: 'true | false', page: 'number', limit: 'number' },
          response: '{ success, message, data: { camps, total, page, pages } }'
        },
        'GET /camps/:id': {
          description: 'Get single donation camp',
          access: 'Authenticated',
          response: '{ success, message, data: camp }'
        },
        'POST /camps': {
          description: 'Create a donation camp',
          access: 'Admin, BloodBank',
          body: { CampName: 'string', Date: 'Date', Time: 'string', Venue: 'string', Organizer: 'string' },
          response: '{ success, message, data: camp }'
        },
        'PUT /camps/:id': {
          description: 'Update a donation camp',
          access: 'Admin, BloodBank',
          body: { CampName: 'string', Date: 'Date', Time: 'string', Venue: 'string', Organizer: 'string' },
          response: '{ success, message, data: camp }'
        },
        'DELETE /camps/:id': {
          description: 'Delete a donation camp',
          access: 'Admin',
          response: '{ success, message, data: camp }'
        }
      },
      admin: {
        'GET /admin/dashboard': {
          description: 'Get dashboard statistics',
          access: 'Admin',
          response: '{ success, message, data: { totalDonors, totalBloodBanks, totalHospitals, totalAvailableUnits, bloodStock, totalRequests, pendingRequests, approvedRequests, fulfilledRequests, totalCamps, upcomingCamps, donorsByGroup } }'
        }
      },
      notifications: {
        'GET /notifications': {
          description: 'Get all notifications',
          access: 'Authenticated',
          query: { page: 'number', limit: 'number' },
          response: '{ success, message, data: { notifications, total, page, pages } }'
        },
        'POST /notifications': {
          description: 'Create a notification',
          access: 'Admin',
          body: { Title: 'string', Description: 'string' },
          response: '{ success, message, data: notification }'
        },
        'DELETE /notifications/:id': {
          description: 'Delete a notification',
          access: 'Admin',
          response: '{ success, message, data: notification }'
        }
      },
      feedback: {
        'GET /feedback': {
          description: 'Get all feedback with average rating',
          access: 'Admin',
          query: { page: 'number', limit: 'number' },
          response: '{ success, message, data: { feedbacks, total, averageRating, page, pages } }'
        },
        'POST /feedback': {
          description: 'Submit feedback',
          access: 'Authenticated',
          body: { Name: 'string', Rating: 'number (1-5)', Message: 'string' },
          response: '{ success, message, data: feedback }'
        }
      }
    },
    responseFormat: {
      success: '{ success: true, message: "string", data: object/array }',
      error: '{ success: false, message: "string", error: "string" }',
      validationError: '{ success: false, message: "Validation Error", errors: ["message1", "message2"] }'
    },
    statusCodeReference: {
      '200': 'OK - Request succeeded',
      '201': 'Created - Resource created successfully',
      '400': 'Bad Request - Invalid input / validation error',
      '401': 'Unauthorized - Missing or invalid token',
      '403': 'Forbidden - Insufficient role permissions',
      '404': 'Not Found - Resource not found',
      '500': 'Internal Server Error'
    }
  };
  res.json(docs);
});

// ======================== HEALTH CHECK ========================

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'TNBBMS Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV,
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// ======================== ROOT ROUTE ========================

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🩸 Welcome to Tamil Nadu Blood Bank Management System API',
    version: '1.0.0',
    documentation: `http://localhost:${PORT}/api-docs`,
    healthCheck: `http://localhost:${PORT}/health`,
    endpoints: {
      auth: { register: 'POST /register', login: 'POST /login', profile: 'GET /me' },
      donors: { list: 'GET /donors', register: 'POST /donor/register', update: 'PUT /donor/update', delete: 'DELETE /donor/delete' },
      bloodbanks: { list: 'GET /bloodbanks', create: 'POST /bloodbanks', update: 'PUT /bloodbanks/:id', delete: 'DELETE /bloodbanks/:id' },
      blood: { search: 'GET /blood/search?group=A+', request: 'POST /blood/request', listRequests: 'GET /blood/request' },
      camps: { list: 'GET /camps', create: 'POST /camps', update: 'PUT /camps/:id', delete: 'DELETE /camps/:id' },
      hospitals: { list: 'GET /hospitals', create: 'POST /hospitals' },
      admin: { dashboard: 'GET /admin/dashboard' },
      notifications: { list: 'GET /notifications', create: 'POST /notifications' },
      feedback: { list: 'GET /feedback', submit: 'POST /feedback' }
    }
  });
});

// ======================== 404 HANDLER ========================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    hint: 'Visit /api-docs for complete API documentation'
  });
});

// ======================== GLOBAL ERROR HANDLER ========================

app.use((err, req, res, next) => {
  console.error('🔥 Global Error:', err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: NODE_ENV === 'development' ? err.stack : undefined
  });
});

// ======================== START SERVER ========================

const startServer = async () => {
  try {
    await seedDatabase();
    app.listen(PORT, () => {
      console.log('\n🩸═══════════════════════════════════════════════════════════');
      console.log('   TAMIL NADU BLOOD BANK MANAGEMENT SYSTEM');
      console.log('═══════════════════════════════════════════════════════════════');
      console.log(`   🚀 Server running on: http://localhost:${PORT}`);
      console.log(`   📖 API Documentation: http://localhost:${PORT}/api-docs`);
      console.log(`   ❤️  Health Check:     http://localhost:${PORT}/health`);
      console.log(`   🌍 Environment:       ${NODE_ENV}`);
      console.log('═══════════════════════════════════════════════════════════════\n');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
