// ============================================================================
// HOSPITAL MODEL - Hospital Information & Login Credentials
// ============================================================================

const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  Name: { type: String, required: true, trim: true },
  Address: { type: String, required: true, trim: true },
  Contact: { type: String, required: true, trim: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Hospital', hospitalSchema);
