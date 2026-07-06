// ============================================================================
// FEEDBACK MODEL - User Feedback & Ratings
// ============================================================================

const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  Name: { type: String, required: true, trim: true },
  Rating: { type: Number, required: true, min: 1, max: 5 },
  Message: { type: String, required: true, trim: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
