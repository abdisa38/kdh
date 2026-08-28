const mongoose = require('mongoose');

const teacherProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    employeeIdNumber: {
      type: String,
      required: [true, 'Employee ID is required (e.g. KPS/T/01)'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female'],
      required: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      default: '',
    },
    qualification: {
      type: String,
      default: 'Bachelor of Education (B.Ed)',
    },
    specialization: {
      type: String,
      default: 'General Education',
    },
    assignedClasses: [
      {
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
      },
    ],
    joiningDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['Active', 'On Leave', 'Former'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

teacherProfileSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model('TeacherProfile', teacherProfileSchema);
