const mongoose = require('mongoose');

const markRecordSchema = new mongoose.Schema(
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
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    // Continuous Assessment (CA) breakdown (50% max)
    assessments: {
      quiz1: { type: Number, default: 0, min: 0, max: 10 },
      quiz2: { type: Number, default: 0, min: 0, max: 10 },
      test1: { type: Number, default: 0, min: 0, max: 15 },
      assignment: { type: Number, default: 0, min: 0, max: 10 },
      midExam: { type: Number, default: 0, min: 0, max: 25 },
      project: { type: Number, default: 0, min: 0, max: 10 },
      totalCA: { type: Number, default: 0, min: 0, max: 50 },
    },
    // Final Examination (50% max)
    finalExam: {
      type: Number,
      default: 0,
      min: 0,
      max: 50,
    },
    // Total Mark (100% max) - Pure numerical mark in Ethiopian primary schools
    totalScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    isPassed: {
      type: Boolean,
      default: false,
    },
    remarks: {
      type: String,
      default: '',
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Unique index per student, subject, semester, academic year
markRecordSchema.index(
  { student: 1, subject: 1, semester: 1, academicYear: 1 },
  { unique: true }
);

// Pre-save hook to compute total CA, totalScore and pass status
markRecordSchema.pre('save', function (next) {
  const a = this.assessments;
  const calculatedCA =
    (a.quiz1 || 0) +
    (a.quiz2 || 0) +
    (a.test1 || 0) +
    (a.assignment || 0) +
    (a.midExam || 0) +
    (a.project || 0);

  if (calculatedCA > 0) {
    this.assessments.totalCA = Math.min(calculatedCA, 50);
  }

  const finalExamScore = this.finalExam || 0;
  const caScore = this.assessments.totalCA || 0;
  this.totalScore = Math.min(Math.round((caScore + finalExamScore) * 10) / 10, 100);
  this.isPassed = this.totalScore >= 50;

  if (!this.remarks) {
    if (this.totalScore >= 85) this.remarks = 'በጣም ከፍተኛ (Excellent)';
    else if (this.totalScore >= 75) this.remarks = 'ከፍተኛ (Very Good)';
    else if (this.totalScore >= 60) this.remarks = 'መካከለኛ (Good)';
    else if (this.totalScore >= 50) this.remarks = 'በቂ (Satisfactory)';
    else this.remarks = 'ዝቅተኛ (Needs Improvement)';
  }

  next();
});

module.exports = mongoose.model('MarkRecord', markRecordSchema);
