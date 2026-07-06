// ============================================================================
// BLOOD BANK CONTROLLER - Blood Bank CRUD & Blood Availability Search
// ============================================================================

const BloodBank = require('../models/BloodBank');
const { apiResponse, handleError } = require('../utils/helpers');

// GET /bloodbanks - Get all blood banks (with pagination & district filter)
const getAllBloodBanks = async (req, res) => {
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
};

// GET /bloodbanks/:id - Get single blood bank
const getBloodBankById = async (req, res) => {
  try {
    const bloodbank = await BloodBank.findById(req.params.id);
    if (!bloodbank) return apiResponse(res, false, 'Blood bank not found', null, 404);
    return apiResponse(res, true, 'Blood bank fetched successfully', bloodbank);
  } catch (error) {
    return handleError(res, error, 'Failed to fetch blood bank');
  }
};

// POST /bloodbanks - Create a blood bank (Admin/BloodBank role)
const createBloodBank = async (req, res) => {
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
};

// PUT /bloodbanks/:id - Update a blood bank (Admin/BloodBank role)
const updateBloodBank = async (req, res) => {
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
};

// DELETE /bloodbanks/:id - Delete a blood bank (Admin only)
const deleteBloodBank = async (req, res) => {
  try {
    const bloodbank = await BloodBank.findByIdAndDelete(req.params.id);
    if (!bloodbank) return apiResponse(res, false, 'Blood bank not found', null, 404);
    return apiResponse(res, true, 'Blood bank deleted successfully', bloodbank);
  } catch (error) {
    return handleError(res, error, 'Blood bank deletion failed');
  }
};

// GET /blood/search?group=A+ - Search blood availability across all blood banks
const searchBloodAvailability = async (req, res) => {
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
};

module.exports = {
  getAllBloodBanks, getBloodBankById, createBloodBank,
  updateBloodBank, deleteBloodBank, searchBloodAvailability
};
