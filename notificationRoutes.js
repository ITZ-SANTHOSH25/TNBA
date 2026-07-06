// ============================================================================
// NOTIFICATION ROUTES - System Notifications & Alerts
// ============================================================================

const express = require('express');
const router = express.Router();
const { getAllNotifications, createNotification, deleteNotification } = require('../controllers/notificationController');
const { authMiddleware, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

router.get('/', getAllNotifications);
router.post('/', authorize('Admin'), createNotification);
router.delete('/:id', authorize('Admin'), deleteNotification);

module.exports = router;
