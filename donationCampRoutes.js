// ============================================================================
// DONATION CAMP ROUTES - Blood Donation Camp CRUD Operations
// ============================================================================

const express = require('express');
const router = express.Router();
const { getAllCamps, getCampById, createCamp, updateCamp, deleteCamp } = require('../controllers/donationCampController');
const { authMiddleware, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

router.get('/', getAllCamps);
router.get('/:id', getCampById);
router.post('/', authorize('Admin', 'BloodBank'), createCamp);
router.put('/:id', authorize('Admin', 'BloodBank'), updateCamp);
router.delete('/:id', authorize('Admin'), deleteCamp);

module.exports = router;
