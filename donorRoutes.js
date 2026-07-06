// ============================================================================
// DONOR ROUTES - Donor Profile Management & Search
// ============================================================================

const express = require('express');
const router = express.Router();
const { getAllDonors, getDonorById, registerDonor, updateDonor, deleteDonor } = require('../controllers/donorController');
const { authMiddleware } = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

router.get('/', getAllDonors);
router.get('/:id', getDonorById);
router.post('/register', registerDonor);
router.put('/update', updateDonor);
router.delete('/delete', deleteDonor);

module.exports = router;
