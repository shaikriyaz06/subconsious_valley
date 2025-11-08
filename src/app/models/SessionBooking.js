import mongoose from 'mongoose';

const sessionBookingSchema = new mongoose.Schema({
  session_id: {
    type: String,
    required: true
  },
  session_title: {
    type: String,
    required: true
  },
  user_email: {
    type: String,
    required: true
  },
  user_name: {
    type: String
  },
  booking_date: {
    type: Date,
    default: Date.now
  },
  scheduled_date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  language_preference: {
    type: String,
    enum: ['english', 'indian_english', 'hindi', 'arabic', 'tagalog', 'chinese']
  },
  notes: {
    type: String
  },
  payment_status: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  amount_paid: {
    type: Number
  }
}, {
  timestamps: true
});

// Index for faster queries
sessionBookingSchema.index({ user_email: 1, session_id: 1 });
sessionBookingSchema.index({ scheduled_date: 1, status: 1 });

export default mongoose.models.SessionBooking || mongoose.model('SessionBooking', sessionBookingSchema);