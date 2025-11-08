import mongoose from 'mongoose';

const purchaseSchema = new mongoose.Schema({
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
  amount_paid: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  payment_status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  stripe_payment_intent_id: {
    type: String
  },
  purchase_date: {
    type: Date,
    default: Date.now
  },
  access_granted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for faster queries
purchaseSchema.index({ user_email: 1, session_id: 1 });

export default mongoose.models.Purchase || mongoose.model('Purchase', purchaseSchema);