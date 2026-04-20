const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College', required: true },
  points: { type: Number, default: 0 },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  profile: {
    branch: { type: String, default: '' },
    year: { type: String, default: '' },
    skills: [{ type: String }]
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
