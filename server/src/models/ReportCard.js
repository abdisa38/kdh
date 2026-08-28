const mongoose = require('mongoose');

const reportCardSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StudentProfile',
      required: true,
    },
    academicYear: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AcademicYear',
      required: true,
    },
    semester: {
      type: String,
      enum: ['Semester 1', 'Semester 2'],
      required: true,
    },
    classRoom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClassRoom',
      required: true,
    },
    subjectRecords: [
      {
        subject: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Subject',
        },
        subjectName: { type: String, required: true },
        subjectNameAmharic: { type: String, default: '' },
        caScore: { type: Number, default: 0 },
        finalExamScore: { type: Number, default: 0 },
        totalScore: { type: Number, default: 0 },
        letterGrade: { type: String, default: 'F' },
        passMark: { type: Number, default: 50 },
        isPassed: { type: Boolean, default: false },
      },
    ],
    totalMarks: {
      type: Number,
      default: 0,
    },
    maxPossibleMarks: {
      type: Number,
      default: 0,
    },
    average: {
      type: Number,
      default: 0,
    },
    rank: {
      type: Number,
      default: 0,
    },
    totalStudentsInClass: {
      type: Number,
      default: 0,
    },
    conduct: {
      type: String,
      enum: ['A', 'B', 'C', 'D'],
      default: 'A',
    },
    attendance: {
      daysPresent: { type: Number, default: 90 },
      daysAbsent: { type: Number, default: 2 },
      totalDays: { type: Number, default: 92 },
    },
    status: {
      type: String,
      enum: ['Promoted', 'Promoted with Warning', 'Retained', 'Pending'],
      default: 'Pending',
    },
    teacherComment: {
      type: String,
      default: 'Good academic performance and respectful behavior.',
    },
    directorRemarks: {
      type: String,
      default: 'Approved by Karadibayu Primary School Academic Committee.',
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

reportCardSchema.index(
  { student: 1, academicYear: 1, semester: 1 },
  { unique: true }
);

module.exports = mongoose.model('ReportCard', reportCardSchema);
