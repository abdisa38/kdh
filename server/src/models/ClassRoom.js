const mongoose = require('mongoose');

const classRoomSchema = new mongoose.Schema(
  {
    gradeLevel: {
      type: Number,
      required: [true, 'Grade level is required (1-8)'],
      min: 1,
      max: 8,
    },
    section: {
      type: String,
      required: [true, 'Section is required (A, B, C, etc.)'],
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true, // e.g. "Grade 7 - Section A"
    },
    academicYear: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AcademicYear',
      required: true,
    },
    homeRoomTeacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    roomNumber: {
      type: String,
      default: '',
    },
    capacity: {
      type: Number,
      default: 50,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

classRoomSchema.index({ gradeLevel: 1, section: 1, academicYear: 1 }, { unique: true });

module.exports = mongoose.model('ClassRoom', classRoomSchema);
