// ============================================================================
// ADMIN ROUTES - Dashboard & Administration
// ============================================================================

const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/adminController');
const { authMiddleware, authorize } = require('../middleware/auth');

// All routes require authentication + Admin role
router.use(authMiddleware);
router.use(authorize('Admin'));

router.get('/dashboard', getDashboardStats);

module.exports = router;
