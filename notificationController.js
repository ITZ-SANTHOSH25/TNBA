// ============================================================================
// NOTIFICATION CONTROLLER - System Notifications & Alerts
// ============================================================================

const Notification = require('../models/Notification');
const { apiResponse, handleError } = require('../utils/helpers');

// GET /notifications - Get all notifications
const getAllNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const notifications = await Notification.find()
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ Date: -1 });
    const total = await Notification.countDocuments();
    return apiResponse(res, true, 'Notifications fetched successfully', {
      notifications, total, page: parseInt(page), pages: Math.ceil(total / limit)
    });
  } catch (error) {
    return handleError(res, error, 'Failed to fetch notifications');
  }
};

// POST /notifications - Create a notification (Admin only)
const createNotification = async (req, res) => {
  try {
    const { Title, Description } = req.body;
    if (!Title || !Description) {
      return apiResponse(res, false, 'Please provide Title and Description', null, 400);
    }
    const notification = await Notification.create({ Title, Description, CreatedBy: req.user._id });
    return apiResponse(res, true, 'Notification created successfully', notification, 201);
  } catch (error) {
    return handleError(res, error, 'Notification creation failed');
  }
};

// DELETE /notifications/:id - Delete notification (Admin only)
const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) return apiResponse(res, false, 'Notification not found', null, 404);
    return apiResponse(res, true, 'Notification deleted successfully', notification);
  } catch (error) {
    return handleError(res, error, 'Notification deletion failed');
  }
};

module.exports = { getAllNotifications, createNotification, deleteNotification };
