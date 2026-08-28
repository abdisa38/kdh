const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Subject name is required'],
      trim: true,
    },
    nameAmharic: {
      type: String,
      trim: true,
      default: '',
    },
    code: {
      type: String,
      required: [true, 'Subject code is required (e.g. ENG-07, MATH-08)'],
      trim: true,
      uppercase: true,
    },
    gradeLevel: {
      type: Number,
      required: [true, 'Grade level is required (1-8)'],
      min: 1,
      max: 8,
    },
    category: {
      type: String,
      enum: ['Core', 'Science', 'Language', 'Social', 'Arts & Physical', 'Technical'],
      default: 'Core',
    },
    totalMaxMarks: {
      type: Number,
      default: 100,
    },
    caMaxMarks: {
      type: Number,
      default: 50, // Continuous assessment max marks
    },
    finalExamMaxMarks: {
      type: Number,
      default: 50, // Final exam max marks
    },
    passMark: {
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

subjectSchema.index({ code: 1, gradeLevel: 1 }, { unique: true });

module.exports = mongoose.model('Subject', subjectSchema);
