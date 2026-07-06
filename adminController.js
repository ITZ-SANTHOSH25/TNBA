// ============================================================================
// ADMIN CONTROLLER - Dashboard Statistics
// ============================================================================

const Donor = require('../models/Donor');
const BloodBank = require('../models/BloodBank');
const Hospital = require('../models/Hospital');
const BloodRequest = require('../models/BloodRequest');
const DonationCamp = require('../models/DonationCamp');
const { apiResponse, handleError } = require('../utils/helpers');

// GET /admin/dashboard - Dashboard Statistics
const getDashboardStats = async (req, res) => {
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
};

module.exports = { getDashboardStats };
