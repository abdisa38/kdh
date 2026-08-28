const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    titleAmharic: {
      type: String,
      trim: true,
      default: '',
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    contentAmharic: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: ['General', 'Exam', 'Holiday', 'Registration', 'Sports & Clubs', 'Academic'],
      default: 'General',
    },
    targetAudience: {
      type: String,
      enum: ['All', 'Students', 'Teachers', 'Parents'],
      default: 'All',
    },
    priority: {
      type: String,
      enum: ['Low', 'Normal', 'High', 'Urgent'],
      default: 'Normal',
    },
    publishedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Announcement', announcementSchema);
