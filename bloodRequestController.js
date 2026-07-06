// ============================================================================
// BLOOD REQUEST CONTROLLER - Emergency Blood Request Management
// ============================================================================

const BloodRequest = require('../models/BloodRequest');
const { apiResponse, handleError } = require('../utils/helpers');

// POST /blood/request - Create an emergency blood request
const createBloodRequest = async (req, res) => {
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
};

// GET /blood/request - Get all blood requests
const getAllBloodRequests = async (req, res) => {
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
};

// GET /blood/request/:id - Get single blood request
const getBloodRequestById = async (req, res) => {
  try {
    const bloodRequest = await BloodRequest.findById(req.params.id).populate('RequestedBy', 'Name Email Mobile Role');
    if (!bloodRequest) return apiResponse(res, false, 'Blood request not found', null, 404);
    return apiResponse(res, true, 'Blood request fetched successfully', bloodRequest);
  } catch (error) {
    return handleError(res, error, 'Failed to fetch blood request');
  }
};

// PUT /blood/request/:id - Update blood request status (Admin/BloodBank)
const updateBloodRequestStatus = async (req, res) => {
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
};

module.exports = { createBloodRequest, getAllBloodRequests, getBloodRequestById, updateBloodRequestStatus };
