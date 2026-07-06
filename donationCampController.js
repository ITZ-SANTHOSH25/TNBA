// ============================================================================
// DONATION CAMP CONTROLLER - Blood Donation Camp CRUD Operations
// ============================================================================

const DonationCamp = require('../models/DonationCamp');
const { apiResponse, handleError } = require('../utils/helpers');

// GET /camps - Get all donation camps
const getAllCamps = async (req, res) => {
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
};

// GET /camps/:id - Get single camp
const getCampById = async (req, res) => {
  try {
    const camp = await DonationCamp.findById(req.params.id);
    if (!camp) return apiResponse(res, false, 'Donation camp not found', null, 404);
    return apiResponse(res, true, 'Donation camp fetched successfully', camp);
  } catch (error) {
    return handleError(res, error, 'Failed to fetch donation camp');
  }
};

// POST /camps - Create a donation camp (Admin/BloodBank only)
const createCamp = async (req, res) => {
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
};

// PUT /camps/:id - Update a donation camp (Admin/BloodBank only)
const updateCamp = async (req, res) => {
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
};

// DELETE /camps/:id - Delete a donation camp (Admin only)
const deleteCamp = async (req, res) => {
  try {
    const camp = await DonationCamp.findByIdAndDelete(req.params.id);
    if (!camp) return apiResponse(res, false, 'Donation camp not found', null, 404);
    return apiResponse(res, true, 'Donation camp deleted successfully', camp);
  } catch (error) {
    return handleError(res, error, 'Donation camp deletion failed');
  }
};

module.exports = { getAllCamps, getCampById, createCamp, updateCamp, deleteCamp };
