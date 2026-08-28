const mongoose = require('mongoose');

const academicYearSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Academic Year name is required (e.g., 2026/2018 E.C.)'],
      unique: true,
      trim: true,
    },
    ethiopianYear: {
      type: Number,
      default: 2018,
    },
    gregorianYear: {
      type: Number,
      default: 2026,
    },
    isCurrent: {
      type: Boolean,
      default: false,
    },
    semesters: [
      {
        name: {
          type: String,
          enum: ['Semester 1', 'Semester 2'],
          required: true,
        },
        nameAmharic: {
          type: String,
          default: 'የመጀመሪያ ወሰነ-ትምህርት',
        },
        startDate: {
          type: Date,
        },
        endDate: {
          type: Date,
        },
        isCurrent: {
          type: Boolean,
          default: false,
        },
        isLocked: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('AcademicYear', academicYearSchema);
