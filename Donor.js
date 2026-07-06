// ============================================================================
// DONOR MODEL - Donor Profile & Blood Group Information
// ============================================================================

const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  Name: { type: String, required: true, trim: true },
  Email: { type: String, required: true, trim: true },
  Mobile: { type: String, required: true, trim: true },
  BloodGroup: { type: String, required: true, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
  Age: { type: Number, required: true, min: 18, max: 65 },
  Weight: { type: Number, required: true, min: 45 },
  LastDonationDate: { type: Date, default: null },
  Availability: { type: String, enum: ['Available', 'Unavailable', 'Deferred'], default: 'Available' },
  Address: { type: String, trim: true, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Donor', donorSchema);
