const mongoose = require('mongoose');

// User schema matches requested database schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed password
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  dob: { type: Date }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
