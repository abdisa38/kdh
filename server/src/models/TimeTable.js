const mongoose = require('mongoose');

const timeTableSchema = new mongoose.Schema(
  {
    classRoom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClassRoom',
      required: true,
    },
    academicYear: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AcademicYear',
    },
    schedule: [
      {
        dayOfWeek: {
          type: String,
          enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          required: true,
        },
        periods: [
          {
            periodNumber: { type: Number, required: true },
            startTime: { type: String, required: true },
            endTime: { type: String, required: true },
            subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
            teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('TimeTable', timeTableSchema);
