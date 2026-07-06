// ============================================================================
// DONOR CONTROLLER - Donor Registration, Profile Management & Search
// ============================================================================

const Donor = require('../models/Donor');
const { apiResponse, handleError } = require('../utils/helpers');

// GET /donors - Get all donors (with pagination & filters)
const getAllDonors = async (req, res) => {
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
};

// GET /donors/:id - Get single donor
const getDonorById = async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);
    if (!donor) return apiResponse(res, false, 'Donor not found', null, 404);
    return apiResponse(res, true, 'Donor fetched successfully', donor);
  } catch (error) {
    return handleError(res, error, 'Failed to fetch donor');
  }
};

// POST /donor/register - Register as a donor
const registerDonor = async (req, res) => {
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
};

// PUT /donor/update - Update donor profile
const updateDonor = async (req, res) => {
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
};

// DELETE /donor/delete - Delete donor profile
const deleteDonor = async (req, res) => {
  try {
    const donor = await Donor.findOneAndDelete({ userId: req.user._id });
    if (!donor) return apiResponse(res, false, 'Donor profile not found', null, 404);
    return apiResponse(res, true, 'Donor profile deleted successfully', donor);
  } catch (error) {
    return handleError(res, error, 'Donor deletion failed');
  }
};

module.exports = { getAllDonors, getDonorById, registerDonor, updateDonor, deleteDonor };
