// ============================================================================
// NOTIFICATION MODEL - System Notifications & Alerts
// ============================================================================

const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  Title: { type: String, required: true, trim: true },
  Description: { type: String, required: true, trim: true },
  Date: { type: Date, default: Date.now },
  CreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
