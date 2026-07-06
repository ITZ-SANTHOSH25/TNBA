// ============================================================================
// BLOOD BANK ROUTES - Blood Bank CRUD & Blood Availability
// ============================================================================

const express = require('express');
const router = express.Router();
const { getAllBloodBanks, getBloodBankById, createBloodBank, updateBloodBank, deleteBloodBank } = require('../controllers/bloodBankController');
const { searchBloodAvailability } = require('../controllers/bloodBankController');
const { authMiddleware, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

router.get('/', getAllBloodBanks);
router.get('/search', searchBloodAvailability);
router.get('/:id', getBloodBankById);
router.post('/', authorize('Admin', 'BloodBank'), createBloodBank);
router.put('/:id', authorize('Admin', 'BloodBank'), updateBloodBank);
router.delete('/:id', authorize('Admin'), deleteBloodBank);

module.exports = router;
