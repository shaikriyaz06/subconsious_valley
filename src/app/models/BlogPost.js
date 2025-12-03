import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    required: true
  },
  featured_image: {
    type: String
  },
  tags: [{
    type: String
  }],
  published: {
    type: Boolean,
    default: false
  },
  read_time: {
    type: Number
  },
  created_by_id: {
    type: String
  },
  created_by: {
    type: String
  },
  is_sample: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

blogPostSchema.index({ published: 1, createdAt: -1 });

export default mongoose.models.BlogPost || mongoose.model('BlogPost', blogPostSchema);