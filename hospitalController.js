// ============================================================================
// HOSPITAL CONTROLLER - Hospital CRUD Operations
// ============================================================================

const User = require('../models/User');
const Hospital = require('../models/Hospital');
const { apiResponse, handleError } = require('../utils/helpers');

// GET /hospitals - Get all hospitals
const getAllHospitals = async (req, res) => {
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
};

// POST /hospitals - Register a hospital (Admin only)
const createHospital = async (req, res) => {
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
};

// PUT /hospitals/:id - Update hospital (Admin only)
const updateHospital = async (req, res) => {
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
};

// DELETE /hospitals/:id - Delete hospital (Admin only)
const deleteHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findByIdAndDelete(req.params.id);
    if (!hospital) return apiResponse(res, false, 'Hospital not found', null, 404);
    if (hospital.userId) await User.findByIdAndDelete(hospital.userId);
    return apiResponse(res, true, 'Hospital deleted successfully', hospital);
  } catch (error) {
    return handleError(res, error, 'Hospital deletion failed');
  }
};

module.exports = { getAllHospitals, createHospital, updateHospital, deleteHospital };
