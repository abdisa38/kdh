const StudentProfile = require('../models/StudentProfile');
const TeacherProfile = require('../models/TeacherProfile');
const ClassRoom = require('../models/ClassRoom');
const Subject = require('../models/Subject');
const ReportCard = require('../models/ReportCard');
const AcademicYear = require('../models/AcademicYear');

// @desc    Get comprehensive stats for Admin Dashboard
// @route   GET /api/dashboard/metrics
// @access  Private (Admin)
exports.getAdminMetrics = async (req, res, next) => {
  try {
    const totalStudents = await StudentProfile.countDocuments({ status: 'Active' });
    const maleStudents = await StudentProfile.countDocuments({ status: 'Active', gender: 'Male' });
    const femaleStudents = await StudentProfile.countDocuments({ status: 'Active', gender: 'Female' });

    const totalTeachers = await TeacherProfile.countDocuments({ status: 'Active' });
    const totalClasses = await ClassRoom.countDocuments({ isActive: true });
    const totalSubjects = await Subject.countDocuments({ isActive: true });

    const currentYear = await AcademicYear.findOne({ isCurrent: true });

    // Recent top students
    const topStudents = await ReportCard.find({
      ...(currentYear && { academicYear: currentYear._id }),
    })
      .sort({ average: -1 })
      .limit(6)
      .populate('student', 'firstName middleName lastName studentIdNumber gender')
      .populate('classRoom', 'name gradeLevel section');

    // Grade level distribution
    const gradeCounts = await ClassRoom.aggregate([
      { $match: { isActive: true } },
      {
        $lookup: {
          from: 'studentprofiles',
          localField: '_id',
          foreignField: 'currentClass',
          as: 'students',
        },
      },
      {
        $project: {
          gradeLevel: 1,
          name: 1,
          studentCount: { $size: '$students' },
        },
      },
    ]);

    // Pass / Fail distribution
    const reportCardStats = await ReportCard.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalStudents,
          maleStudents,
          femaleStudents,
          totalTeachers,
          totalClasses,
          totalSubjects,
          academicYear: currentYear ? currentYear.name : '2026/2018 E.C.',
        },
        gradeCounts,
        topStudents,
        reportCardStats,
      },
    });
  } catch (error) {
    next(error);
  }
};
