// ============================================================================
// ENVIRONMENT CONFIGURATION - All env variables defined here
// ============================================================================
// No separate .env file needed. To override, set environment variables
// before running the server (e.g., PORT=8080 node server.js).
// ============================================================================

process.env.PORT = process.env.PORT || '5000';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/tn_bloodbank';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'tnbbms_super_secret_key_2024_production';
process.env.BCRYPT_SALT_ROUNDS = process.env.BCRYPT_SALT_ROUNDS || '10';

module.exports = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS)
};
