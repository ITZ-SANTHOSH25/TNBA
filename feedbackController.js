// ============================================================================
// FEEDBACK CONTROLLER - User Feedback & Ratings
// ============================================================================

const Feedback = require('../models/Feedback');
const { apiResponse, handleError } = require('../utils/helpers');

// GET /feedback - Get all feedback (Admin only)
const getAllFeedback = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const feedbacks = await Feedback.find()
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    const total = await Feedback.countDocuments();
    const avgRating = await Feedback.aggregate([
      { $group: { _id: null, averageRating: { $avg: '$Rating' } } }
    ]);
    return apiResponse(res, true, 'Feedback fetched successfully', {
      feedbacks, total, averageRating: avgRating[0]?.averageRating?.toFixed(2) || 0,
      page: parseInt(page), pages: Math.ceil(total / limit)
    });
  } catch (error) {
    return handleError(res, error, 'Failed to fetch feedback');
  }
};

// POST /feedback - Submit feedback
const submitFeedback = async (req, res) => {
  try {
    const { Name, Rating, Message } = req.body;
    if (!Name || !Rating || !Message) {
      return apiResponse(res, false, 'Please provide Name, Rating (1-5), and Message', null, 400);
    }
    if (Rating < 1 || Rating > 5) {
      return apiResponse(res, false, 'Rating must be between 1 and 5', null, 400);
    }
    const feedback = await Feedback.create({ Name, Rating, Message, userId: req.user._id });
    return apiResponse(res, true, 'Feedback submitted successfully', feedback, 201);
  } catch (error) {
    return handleError(res, error, 'Feedback submission failed');
  }
};

module.exports = { getAllFeedback, submitFeedback };
