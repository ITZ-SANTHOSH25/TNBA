// ============================================================================
// BLOOD REQUEST ROUTES - Emergency Blood Request Management
// ============================================================================

const express = require('express');
const router = express.Router();
const { createBloodRequest, getAllBloodRequests, getBloodRequestById, updateBloodRequestStatus } = require('../controllers/bloodRequestController');
const { authMiddleware, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

router.post('/', authorize('Hospital', 'Admin'), createBloodRequest);
router.get('/', getAllBloodRequests);
router.get('/:id', getBloodRequestById);
router.put('/:id', authorize('Admin', 'BloodBank'), updateBloodRequestStatus);

module.exports = router;
