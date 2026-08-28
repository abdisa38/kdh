const TeacherProfile = require('../models/TeacherProfile');
const User = require('../models/User');

// @desc    Get all teachers
// @route   GET /api/teachers
// @access  Private (Admin, Registrar)
exports.getAllTeachers = async (req, res, next) => {
  try {
    const teachers = await TeacherProfile.find()
      .populate('user', 'username email fullName isActive')
      .populate('assignedClasses.classRoom')
      .populate('assignedClasses.subject')
      .sort({ firstName: 1 });

    res.status(200).json({
      success: true,
      count: teachers.length,
      data: teachers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new teacher
// @route   POST /api/teachers
// @access  Private (Admin)
exports.createTeacher = async (req, res, next) => {
  try {
    const {
      employeeIdNumber,
      firstName,
      lastName,
      gender,
      phone,
      email,
      qualification,
      specialization,
      assignedClasses,
      password,
    } = req.body;

    const username = (employeeIdNumber || `${firstName}.${lastName}`).toLowerCase().replace(/[^a-z0-9]/g, '');

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: `Teacher with username/ID '${username}' already exists.`,
      });
    }

    const user = await User.create({
      username,
      email: email || '',
      password: password || 'teacher123',
      role: 'teacher',
      fullName: `${firstName} ${lastName}`,
    });

    const teacher = await TeacherProfile.create({
      user: user._id,
      employeeIdNumber: employeeIdNumber || `KPS/T/${Date.now().toString().slice(-4)}`,
      firstName,
      lastName,
      gender,
      phone,
      email: email || '',
      qualification,
      specialization,
      assignedClasses: assignedClasses || [],
    });

    res.status(201).json({
      success: true,
      message: 'Teacher registered successfully',
      data: teacher,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in teacher's assigned classes & subjects
// @route   GET /api/teachers/me/assigned-classes
// @access  Private (Teacher)
exports.getMyAssignedClasses = async (req, res, next) => {
  try {
    const teacherProfile = await TeacherProfile.findOne({ user: req.user._id })
      .populate('assignedClasses.classRoom')
      .populate('assignedClasses.subject');

    if (!teacherProfile) {
      return res.status(404).json({
        success: false,
        message: 'Teacher profile not found for this user',
      });
    }

    res.status(200).json({
      success: true,
      data: teacherProfile.assignedClasses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign classes and subjects to teacher
// @route   PUT /api/teachers/:id/assign
// @access  Private (Admin)
exports.assignTeacherClasses = async (req, res, next) => {
  try {
    const { assignedClasses } = req.body;

    const teacher = await TeacherProfile.findByIdAndUpdate(
      req.params.id,
      { assignedClasses },
      { new: true }
    )
      .populate('assignedClasses.classRoom')
      .populate('assignedClasses.subject');

    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Class assignments updated successfully',
      data: teacher,
    });
  } catch (error) {
    next(error);
  }
};
