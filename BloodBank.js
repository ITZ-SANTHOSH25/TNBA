// ============================================================================
// BLOOD BANK MODEL - Blood Bank & Stock Information
// ============================================================================

const mongoose = require('mongoose');

const bloodBankSchema = new mongoose.Schema({
  Name: { type: String, required: true, trim: true },
  District: { type: String, required: true, trim: true },
  Contact: { type: String, required: true, trim: true },
  BloodStock: {
    'A+': { type: Number, default: 0, min: 0 },
    'A-': { type: Number, default: 0, min: 0 },
    'B+': { type: Number, default: 0, min: 0 },
    'B-': { type: Number, default: 0, min: 0 },
    'AB+': { type: Number, default: 0, min: 0 },
    'AB-': { type: Number, default: 0, min: 0 },
    'O+': { type: Number, default: 0, min: 0 },
    'O-': { type: Number, default: 0, min: 0 }
  },
  Location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });

bloodBankSchema.index({ Location: '2dsphere' });

module.exports = mongoose.model('BloodBank', bloodBankSchema);
