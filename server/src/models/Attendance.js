const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    classRoom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClassRoom',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    academicYear: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AcademicYear',
    },
    records: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'StudentProfile',
          required: true,
        },
        status: {
          type: String,
          enum: ['Present', 'Absent', 'Late', 'Excused'],
          default: 'Present',
        },
        remark: {
          type: String,
          default: '',
        },
      },
    ],
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

attendanceSchema.index({ classRoom: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
