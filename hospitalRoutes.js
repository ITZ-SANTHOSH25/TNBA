// ============================================================================
// HOSPITAL ROUTES - Hospital CRUD Operations
// ============================================================================

const express = require('express');
const router = express.Router();
const { getAllHospitals, createHospital, updateHospital, deleteHospital } = require('../controllers/hospitalController');
const { authMiddleware, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

router.get('/', getAllHospitals);
router.post('/', authorize('Admin'), createHospital);
router.put('/:id', authorize('Admin'), updateHospital);
router.delete('/:id', authorize('Admin'), deleteHospital);

module.exports = router;
