const MarkRecord = require('../models/MarkRecord');
const StudentProfile = require('../models/StudentProfile');
const Subject = require('../models/Subject');
const ClassRoom = require('../models/ClassRoom');
const AcademicYear = require('../models/AcademicYear');

// @desc    Get marksheet roster for a classroom, subject & semester
// @route   GET /api/marks/roster
// @access  Private (Teacher, Admin)
exports.getClassMarksheet = async (req, res, next) => {
  try {
    const { classRoomId, subjectId, semester, academicYearId } = req.query;

    if (!classRoomId || !subjectId) {
      return res.status(400).json({
        success: false,
        message: 'classRoomId and subjectId are required parameters',
      });
    }

    let academicYear = null;
    if (academicYearId) {
      academicYear = await AcademicYear.findById(academicYearId);
    } else {
      academicYear = await AcademicYear.findOne({ isCurrent: true });
    }

    const selectedSemester = semester || 'Semester 1';

    // 1. Fetch Subject & ClassRoom
    const subject = await Subject.findById(subjectId);
    const classRoom = await ClassRoom.findById(classRoomId);

    if (!subject || !classRoom) {
      return res.status(404).json({
        success: false,
        message: 'Subject or ClassRoom not found',
      });
    }

    // 2. Fetch all active students in class
    const students = await StudentProfile.find({
      currentClass: classRoomId,
      status: 'Active',
    }).sort({ rollNumber: 1, firstName: 1 });

    // 3. Fetch existing mark records
    const existingMarks = await MarkRecord.find({
      classRoom: classRoomId,
      subject: subjectId,
      academicYear: academicYear._id,
      semester: selectedSemester,
    });

    const marksMap = {};
    existingMarks.forEach((m) => {
      marksMap[m.student.toString()] = m;
    });

    // 4. Combine into complete roster
    const roster = students.map((student) => {
      const existing = marksMap[student._id.toString()];
      return {
        studentId: student._id,
        studentIdNumber: student.studentIdNumber,
        fullName: student.fullName,
        gender: student.gender,
        rollNumber: student.rollNumber,
        markRecordId: existing ? existing._id : null,
        assessments: existing
          ? existing.assessments
          : {
              quiz1: 0,
              quiz2: 0,
              test1: 0,
              assignment: 0,
              midExam: 0,
              project: 0,
              totalCA: 0,
            },
        finalExam: existing ? existing.finalExam : 0,
        totalScore: existing ? existing.totalScore : 0,
        letterGrade: existing ? existing.letterGrade : 'F',
        remarks: existing ? existing.remarks : '',
        isLocked: existing ? existing.isLocked : false,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        subject,
        classRoom,
        academicYear,
        semester: selectedSemester,
        roster,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Save/Update bulk marks for multiple students in a class
// @route   POST /api/marks/bulk-save
// @access  Private (Teacher, Admin)
exports.saveBulkMarks = async (req, res, next) => {
  try {
    const { classRoomId, subjectId, semester, academicYearId, entries } = req.body;

    if (!classRoomId || !subjectId || !entries || !Array.isArray(entries)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payload. classRoomId, subjectId, and entries array are required.',
      });
    }

    let yearId = academicYearId;
    if (!yearId) {
      const curr = await AcademicYear.findOne({ isCurrent: true });
      if (!curr) {
        return res.status(400).json({ success: false, message: 'No active academic year found' });
      }
      yearId = curr._id;
    }

    const selectedSemester = semester || 'Semester 1';

    const savedRecords = [];

    for (const item of entries) {
      const { studentId, assessments, finalExam, remarks } = item;

      let markRecord = await MarkRecord.findOne({
        student: studentId,
        subject: subjectId,
        classRoom: classRoomId,
        academicYear: yearId,
        semester: selectedSemester,
      });

      if (!markRecord) {
        markRecord = new MarkRecord({
          student: studentId,
          subject: subjectId,
          classRoom: classRoomId,
          academicYear: yearId,
          semester: selectedSemester,
          teacher: req.user._id,
        });
      }

      if (markRecord.isLocked && req.user.role !== 'admin') {
        continue; // Skip locked records unless admin
      }

      if (assessments) {
        markRecord.assessments = {
          quiz1: Number(assessments.quiz1 || 0),
          quiz2: Number(assessments.quiz2 || 0),
          test1: Number(assessments.test1 || 0),
          assignment: Number(assessments.assignment || 0),
          midExam: Number(assessments.midExam || 0),
          project: Number(assessments.project || 0),
          totalCA: Number(assessments.totalCA || 0),
        };
      }

      if (finalExam !== undefined) {
        markRecord.finalExam = Number(finalExam);
      }

      if (remarks !== undefined) {
        markRecord.remarks = remarks;
      }

      await markRecord.save();
      savedRecords.push(markRecord);
    }

    res.status(200).json({
      success: true,
      message: `Successfully saved marks for ${savedRecords.length} students.`,
      data: savedRecords,
    });
  } catch (error) {
    next(error);
  }
};
