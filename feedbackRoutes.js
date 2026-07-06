// ============================================================================
// FEEDBACK ROUTES - User Feedback & Ratings
// ============================================================================

const express = require('express');
const router = express.Router();
const { getAllFeedback, submitFeedback } = require('../controllers/feedbackController');
const { authMiddleware, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

router.get('/', authorize('Admin'), getAllFeedback);
router.post('/', submitFeedback);

module.exports = router;
