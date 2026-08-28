const StudentProfile = require('../models/StudentProfile');
const User = require('../models/User');
const MarkRecord = require('../models/MarkRecord');
const ReportCard = require('../models/ReportCard');
const AcademicYear = require('../models/AcademicYear');

// @desc    Get all students (with filter, search & pagination)
// @route   GET /api/students
// @access  Private (Admin, Registrar, Teacher)
exports.getAllStudents = async (req, res, next) => {
  try {
    const { classId, gradeLevel, search, status } = req.query;
    let query = {};

    if (classId) query.currentClass = classId;
    if (status) query.status = status;

    let students = await StudentProfile.find(query)
      .populate('user', 'username email fullName isActive')
      .populate({
        path: 'currentClass',
        populate: { path: 'academicYear' },
      })
      .sort({ studentIdNumber: 1 });

    if (gradeLevel) {
      students = students.filter(
        (s) => s.currentClass && s.currentClass.gradeLevel === parseInt(gradeLevel)
      );
    }

    if (search) {
      const sLower = search.toLowerCase();
      students = students.filter(
        (s) =>
          s.firstName.toLowerCase().includes(sLower) ||
          s.middleName.toLowerCase().includes(sLower) ||
          s.lastName.toLowerCase().includes(sLower) ||
          s.studentIdNumber.toLowerCase().includes(sLower)
      );
    }

    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single student details
// @route   GET /api/students/:id
// @access  Private
exports.getStudentById = async (req, res, next) => {
  try {
    const student = await StudentProfile.findById(req.params.id)
      .populate('user', 'username email fullName isActive')
      .populate({
        path: 'currentClass',
        populate: { path: 'academicYear' },
      });

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.status(200).json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new student and user account
// @route   POST /api/students
// @access  Private (Admin, Registrar)
exports.createStudent = async (req, res, next) => {
  try {
    const {
      studentIdNumber,
      firstName,
      middleName,
      lastName,
      firstNameAmharic,
      middleNameAmharic,
      lastNameAmharic,
      gender,
      dateOfBirth,
      currentClass,
      parentName,
      parentPhone,
      address,
      password,
    } = req.body;

    const username = studentIdNumber.toLowerCase().replace(/[^a-z0-9]/g, '');

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: `Student with ID/Username '${studentIdNumber}' already exists.`,
      });
    }

    // 1. Create User account
    const user = await User.create({
      username,
      password: password || 'kps123456', // default password
      role: 'student',
      fullName: `${firstName} ${middleName} ${lastName}`,
    });

    // 2. Create Student Profile
    const student = await StudentProfile.create({
      user: user._id,
      studentIdNumber: studentIdNumber.toUpperCase(),
      firstName,
      middleName,
      lastName,
      firstNameAmharic: firstNameAmharic || '',
      middleNameAmharic: middleNameAmharic || '',
      lastNameAmharic: lastNameAmharic || '',
      gender,
      dateOfBirth,
      currentClass,
      parentName,
      parentPhone,
      address,
    });

    const populatedStudent = await StudentProfile.findById(student._id)
      .populate('user', 'username email fullName')
      .populate('currentClass');

    res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      data: populatedStudent,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in student's marks and report card
// @route   GET /api/students/me/results
// @access  Private (Student only)
exports.getMyResults = async (req, res, next) => {
  try {
    const studentProfile = await StudentProfile.findOne({ user: req.user._id })
      .populate({
        path: 'currentClass',
        populate: { path: 'academicYear' },
      });

    if (!studentProfile) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found for this user',
      });
    }

    const { semester, academicYearId } = req.query;

    let academicYear = null;
    if (academicYearId) {
      academicYear = await AcademicYear.findById(academicYearId);
    } else {
      academicYear = await AcademicYear.findOne({ isCurrent: true });
    }

    const selectedSemester = semester || 'Semester 1';

    // Fetch marks
    const markRecords = await MarkRecord.find({
      student: studentProfile._id,
      ...(academicYear && { academicYear: academicYear._id }),
      semester: selectedSemester,
    })
      .populate('subject', 'name nameAmharic code category passMark')
      .populate('teacher', 'fullName');

    // Fetch computed Report Card
    const reportCard = await ReportCard.findOne({
      student: studentProfile._id,
      ...(academicYear && { academicYear: academicYear._id }),
      semester: selectedSemester,
    }).populate('classRoom');

    res.status(200).json({
      success: true,
      data: {
        student: studentProfile,
        academicYear,
        semester: selectedSemester,
        marks: markRecords,
        reportCard,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Public student result search by Student ID
// @route   POST /api/students/public/search-result
// @access  Public
exports.publicResultSearch = async (req, res, next) => {
  try {
    const { studentIdNumber, semester } = req.body;

    if (!studentIdNumber) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid Student ID Number',
      });
    }

    const student = await StudentProfile.findOne({
      studentIdNumber: studentIdNumber.trim().toUpperCase(),
    }).populate({
      path: 'currentClass',
      populate: { path: 'academicYear' },
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `No student found with ID: ${studentIdNumber}`,
      });
    }

    const currentYear = await AcademicYear.findOne({ isCurrent: true });
    const selectedSemester = semester || 'Semester 1';

    const reportCard = await ReportCard.findOne({
      student: student._id,
      ...(currentYear && { academicYear: currentYear._id }),
      semester: selectedSemester,
      isPublished: true,
    }).populate('classRoom');

    const marks = await MarkRecord.find({
      student: student._id,
      ...(currentYear && { academicYear: currentYear._id }),
      semester: selectedSemester,
    }).populate('subject', 'name nameAmharic code passMark');

    res.status(200).json({
      success: true,
      data: {
        student: {
          id: student._id,
          studentIdNumber: student.studentIdNumber,
          fullName: student.fullName,
          gender: student.gender,
          className: student.currentClass ? student.currentClass.name : 'N/A',
          gradeLevel: student.currentClass ? student.currentClass.gradeLevel : null,
          section: student.currentClass ? student.currentClass.section : null,
        },
        academicYear: currentYear ? currentYear.name : '2026/2018 E.C.',
        semester: selectedSemester,
        marks,
        reportCard,
      },
    });
  } catch (error) {
    next(error);
  }
};
