const ReportCard = require('../models/ReportCard');
const StudentProfile = require('../models/StudentProfile');
const ClassRoom = require('../models/ClassRoom');
const Subject = require('../models/Subject');
const MarkRecord = require('../models/MarkRecord');
const AcademicYear = require('../models/AcademicYear');
const { calculateClassRankings } = require('../utils/rankingEngine');

// @desc    Trigger calculation of rankings & report cards for a classroom & semester
// @route   POST /api/reports/calculate-ranking
// @access  Private (Admin, Teacher)
exports.computeClassRanking = async (req, res, next) => {
  try {
    const { classRoomId, semester, academicYearId } = req.body;

    if (!classRoomId) {
      return res.status(400).json({ success: false, message: 'classRoomId is required' });
    }

    let yearId = academicYearId;
    if (!yearId) {
      const currentYear = await AcademicYear.findOne({ isCurrent: true });
      if (!currentYear) {
        return res.status(400).json({ success: false, message: 'No active academic year found' });
      }
      yearId = currentYear._id;
    }

    const selectedSemester = semester || 'Semester 1';

    const result = await calculateClassRankings(classRoomId, yearId, selectedSemester);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json({
      success: true,
      message: `Successfully calculated rankings for ${result.totalStudents} students.`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get complete Master Mark Sheet (ማስተር ሺት) for a class & semester
// @route   GET /api/reports/master-sheet
// @access  Private (Admin, Teacher)
exports.getMasterSheet = async (req, res, next) => {
  try {
    const { classRoomId, semester, academicYearId } = req.query;

    if (!classRoomId) {
      return res.status(400).json({ success: false, message: 'classRoomId is required' });
    }

    let academicYear = null;
    if (academicYearId) {
      academicYear = await AcademicYear.findById(academicYearId);
    } else {
      academicYear = await AcademicYear.findOne({ isCurrent: true });
    }

    const selectedSemester = semester || 'Semester 1';

    const classRoom = await ClassRoom.findById(classRoomId).populate('homeRoomTeacher', 'fullName');
    if (!classRoom) {
      return res.status(404).json({ success: false, message: 'Classroom not found' });
    }

    // Fetch all subjects for this grade
    const subjects = await Subject.find({ gradeLevel: classRoom.gradeLevel, isActive: true }).sort({ code: 1 });

    // Fetch all students in class
    const students = await StudentProfile.find({ currentClass: classRoomId, status: 'Active' })
      .sort({ rollNumber: 1, firstName: 1 });

    // Fetch report cards for rankings
    const reportCards = await ReportCard.find({
      classRoom: classRoomId,
      academicYear: academicYear._id,
      semester: selectedSemester,
    });

    const reportCardMap = {};
    reportCards.forEach((rc) => {
      reportCardMap[rc.student.toString()] = rc;
    });

    // Fetch all mark records for this class & semester
    const markRecords = await MarkRecord.find({
      classRoom: classRoomId,
      academicYear: academicYear._id,
      semester: selectedSemester,
    });

    // Build lookup map: studentId_subjectId -> mark
    const markMap = {};
    markRecords.forEach((m) => {
      markMap[`${m.student.toString()}_${m.subject.toString()}`] = m;
    });

    // Construct Master Sheet Rows
    const rows = students.map((student) => {
      const rc = reportCardMap[student._id.toString()];

      const subjectScores = {};
      let calculatedTotal = 0;

      subjects.forEach((subj) => {
        const mark = markMap[`${student._id.toString()}_${subj._id.toString()}`];
        const score = mark ? mark.totalScore : '-';
        subjectScores[subj._id.toString()] = score;
        if (typeof score === 'number') calculatedTotal += score;
      });

      return {
        studentId: student._id,
        studentIdNumber: student.studentIdNumber,
        fullName: student.fullName,
        gender: student.gender,
        subjectScores,
        totalMarks: rc ? rc.totalMarks : calculatedTotal,
        average: rc ? rc.average : (subjects.length > 0 ? Math.round((calculatedTotal / subjects.length) * 10) / 10 : 0),
        rank: rc ? rc.rank : '-',
        conduct: rc ? rc.conduct : 'A',
        status: rc ? rc.status : 'Pending',
      };
    });

    res.status(200).json({
      success: true,
      data: {
        classRoom,
        academicYear,
        semester: selectedSemester,
        subjects,
        rows,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get detailed printable Report Card for a student
// @route   GET /api/reports/student/:studentId
// @access  Private (Admin, Teacher, Student)
exports.getStudentReportCard = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const { semester, academicYearId } = req.query;

    const student = await StudentProfile.findById(studentId).populate('currentClass');
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    let academicYear = null;
    if (academicYearId) {
      academicYear = await AcademicYear.findById(academicYearId);
    } else {
      academicYear = await AcademicYear.findOne({ isCurrent: true });
    }

    const selectedSemester = semester || 'Semester 1';

    let reportCard = await ReportCard.findOne({
      student: student._id,
      academicYear: academicYear._id,
      semester: selectedSemester,
    }).populate('classRoom');

    if (!reportCard) {
      // If not yet generated, attempt calculation on the fly
      await calculateClassRankings(student.currentClass._id, academicYear._id, selectedSemester);
      reportCard = await ReportCard.findOne({
        student: student._id,
        academicYear: academicYear._id,
        semester: selectedSemester,
      }).populate('classRoom');
    }

    res.status(200).json({
      success: true,
      data: {
        student,
        academicYear,
        semester: selectedSemester,
        reportCard,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update conduct, attendance, comments on report card
// @route   PUT /api/reports/:id
// @access  Private (Teacher, Admin)
exports.updateReportCardDetails = async (req, res, next) => {
  try {
    const { conduct, attendance, teacherComment, directorRemarks } = req.body;

    const reportCard = await ReportCard.findByIdAndUpdate(
      req.params.id,
      {
        ...(conduct && { conduct }),
        ...(attendance && { attendance }),
        ...(teacherComment && { teacherComment }),
        ...(directorRemarks && { directorRemarks }),
      },
      { new: true }
    );

    if (!reportCard) {
      return res.status(404).json({ success: false, message: 'Report Card not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Report Card details updated successfully',
      data: reportCard,
    });
  } catch (error) {
    next(error);
  }
};
