// ============================================================================
// USER MODEL - Authentication & Role Management
// ============================================================================

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  Name: { type: String, required: true, trim: true },
  Email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  Mobile: { type: String, required: true, trim: true },
  Password: { type: String, required: true, minlength: 6 },
  Role: { type: String, enum: ['Admin', 'Hospital', 'BloodBank', 'Donor'], default: 'Donor' }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('Password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.Password = await bcrypt.hash(this.Password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.Password);
};

module.exports = mongoose.model('User', userSchema);
