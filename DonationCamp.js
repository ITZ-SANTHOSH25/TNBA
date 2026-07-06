// ============================================================================
// DONATION CAMP MODEL - Blood Donation Camp Events
// ============================================================================

const mongoose = require('mongoose');

const donationCampSchema = new mongoose.Schema({
  CampName: { type: String, required: true, trim: true },
  Date: { type: Date, required: true },
  Time: { type: String, required: true, trim: true },
  Venue: { type: String, required: true, trim: true },
  Organizer: { type: String, required: true, trim: true },
  CreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });

module.exports = mongoose.model('DonationCamp', donationCampSchema);
