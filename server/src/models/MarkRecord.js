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
    // Continuous Assessment (CA) breakdown
    assessments: {
      quiz1: { type: Number, default: 0, min: 0, max: 10 },
      quiz2: { type: Number, default: 0, min: 0, max: 10 },
      test1: { type: Number, default: 0, min: 0, max: 15 },
      assignment: { type: Number, default: 0, min: 0, max: 10 },
      midExam: { type: Number, default: 0, min: 0, max: 25 },
      project: { type: Number, default: 0, min: 0, max: 10 },
      totalCA: { type: Number, default: 0, min: 0, max: 60 },
    },
    finalExam: {
      type: Number,
      default: 0,
      min: 0,
      max: 60,
    },
    totalScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    letterGrade: {
      type: String,
      enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'],
      default: 'F',
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

// Helper function to calculate letter grade according to Ethiopian MoE standard
markRecordSchema.statics.calculateLetterGrade = function (score) {
  if (score >= 90) return 'A+';
  if (score >= 85) return 'A';
  if (score >= 80) return 'B+';
  if (score >= 75) return 'B';
  if (score >= 65) return 'C+';
  if (score >= 50) return 'C';
  if (score >= 40) return 'D';
  return 'F';
};

// Pre-save hook to compute total CA, totalScore and letterGrade
markRecordSchema.pre('save', function (next) {
  const a = this.assessments;
  // If specific components provided, sum them up
  const calculatedCA = (a.quiz1 || 0) + (a.quiz2 || 0) + (a.test1 || 0) + (a.assignment || 0) + (a.midExam || 0) + (a.project || 0);
  
  if (calculatedCA > 0) {
    this.assessments.totalCA = Math.min(calculatedCA, 60);
  }

  const finalExamScore = this.finalExam || 0;
  const caScore = this.assessments.totalCA || 0;
  this.totalScore = Math.min(Math.round((caScore + finalExamScore) * 10) / 10, 100);
  this.isPassed = this.totalScore >= 50;
  this.letterGrade = this.constructor.calculateLetterGrade(this.totalScore);

  if (!this.remarks) {
    if (this.totalScore >= 85) this.remarks = 'Excellent / በጣም ከፍተኛ';
    else if (this.totalScore >= 75) this.remarks = 'Very Good / ከፍተኛ';
    else if (this.totalScore >= 60) this.remarks = 'Good / መካከለኛ';
    else if (this.totalScore >= 50) this.remarks = 'Satisfactory / በቂ';
    else this.remarks = 'Needs Improvement / ዝቅተኛ';
  }

  next();
});

module.exports = mongoose.model('MarkRecord', markRecordSchema);
