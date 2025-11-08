import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    enum: ['admin', 'user', 'team_member'],
    default: 'user'
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  full_name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: false // Not required for Google OAuth users
  },
  provider: {
    type: String,
    enum: ['google', 'credentials'],
    default: 'credentials'
  },
  googleId: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

export default mongoose.models.User || mongoose.model('User', userSchema);