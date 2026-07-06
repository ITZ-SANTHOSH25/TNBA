// ============================================================================
// BLOOD REQUEST MODEL - Emergency Blood Request Management
// ============================================================================

const mongoose = require('mongoose');

const bloodRequestSchema = new mongoose.Schema({
  PatientName: { type: String, required: true, trim: true },
  Hospital: { type: String, required: true, trim: true },
  BloodGroup: { type: String, required: true, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
  UnitsRequired: { type: Number, required: true, min: 1 },
  Status: { type: String, enum: ['Pending', 'Approved', 'Fulfilled', 'Rejected', 'Cancelled'], default: 'Pending' },
  RequestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  Urgency: { type: String, enum: ['Normal', 'Urgent', 'Critical'], default: 'Normal' }
}, { timestamps: true });

module.exports = mongoose.model('BloodRequest', bloodRequestSchema);
