const mongoose = require('mongoose');

const lessonPlanSchema = new mongoose.Schema(
  {
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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
    weekNumber: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    topic: {
      type: String,
      required: true,
    },
    learningObjectives: {
      type: String,
      required: true,
    },
    teachingMethodology: {
      type: String,
      default: 'Interactive student-centered discussion and group problem solving',
    },
    instructionalMaterials: {
      type: String,
      default: 'Textbook, Chalkboard, Science Chart & Worksheets',
    },
    assessmentStrategy: {
      type: String,
      default: 'Classwork review and 5-question oral inquiry',
    },
    status: {
      type: String,
      enum: ['Draft', 'Submitted', 'Approved', 'Needs Revision'],
      default: 'Submitted',
    },
    directorFeedback: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('LessonPlan', lessonPlanSchema);
