const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    studentIdNumber: {
      type: String,
      required: [true, 'Student ID Number is required (e.g., KPS/2026/001)'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    middleName: {
      type: String,
      required: [true, "Father's name (Middle name) is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Grandfather's name (Last name) is required"],
      trim: true,
    },
    firstNameAmharic: {
      type: String,
      trim: true,
      default: '',
    },
    middleNameAmharic: {
      type: String,
      trim: true,
      default: '',
    },
    lastNameAmharic: {
      type: String,
      trim: true,
      default: '',
    },
    gender: {
      type: String,
      enum: ['Male', 'Female'],
      required: true,
    },
    dateOfBirth: {
      type: Date,
    },
    currentClass: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClassRoom',
      required: true,
    },
    rollNumber: {
      type: Number,
      default: 1,
    },
    parentName: {
      type: String,
      required: true,
      trim: true,
    },
    parentPhone: {
      type: String,
      required: true,
      trim: true,
    },
    emergencyPhone: {
      type: String,
      trim: true,
      default: '',
    },
    address: {
      city: { type: String, default: 'Karadibayu' },
      subcity: { type: String, default: '' },
      woreda: { type: String, default: '' },
      kebele: { type: String, default: '01' },
      houseNumber: { type: String, default: '' },
    },
    enrollmentDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['Active', 'Transferred', 'Graduated', 'Inactive'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

studentProfileSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.middleName} ${this.lastName}`;
});

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
