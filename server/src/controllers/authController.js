const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const TeacherProfile = require('../models/TeacherProfile');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both username/Student ID and password',
      });
    }

    const cleanUsername = username.trim().toLowerCase();

    // Check for user (select password)
    const user = await User.findOne({ username: cleanUsername }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. User not found.',
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact school administration.',
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Password incorrect.',
      });
    }

    // Update lastLogin
    user.lastLogin = Date.now();
    await user.save();

    // Fetch associated profile based on role
    let profile = null;
    if (user.role === 'student') {
      profile = await StudentProfile.findOne({ user: user._id }).populate({
        path: 'currentClass',
        populate: { path: 'academicYear' },
      });
    } else if (user.role === 'teacher') {
      profile = await TeacherProfile.findOne({ user: user._id })
        .populate('assignedClasses.classRoom')
        .populate('assignedClasses.subject');
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        profile,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user & profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    let profile = null;

    if (user.role === 'student') {
      profile = await StudentProfile.findOne({ user: user._id }).populate({
        path: 'currentClass',
        populate: { path: 'academicYear' },
      });
    } else if (user.role === 'teacher') {
      profile = await TeacherProfile.findOne({ user: user._id })
        .populate('assignedClasses.classRoom')
        .populate('assignedClasses.subject');
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        profile,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    if (!(await user.matchPassword(currentPassword))) {
      return res.status(401).json({
        success: false,
        message: 'Current password does not match',
      });
    }

    user.password = newPassword;
    await user.save();

    const token = generateToken(user._id);
    res.status(200).json({
      success: true,
      token,
      message: 'Password updated successfully',
    });
  } catch (error) {
    next(error);
  }
};
