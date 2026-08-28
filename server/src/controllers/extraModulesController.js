const Attendance = require('../models/Attendance');
const LessonPlan = require('../models/LessonPlan');
const TimeTable = require('../models/TimeTable');
const AssetItem = require('../models/AssetItem');
const StudentProfile = require('../models/StudentProfile');
const AcademicYear = require('../models/AcademicYear');

// --- Attendance ---
exports.getClassAttendance = async (req, res, next) => {
  try {
    const { classRoomId, date } = req.query;
    if (!classRoomId) {
      return res.status(400).json({ success: false, message: 'classRoomId is required' });
    }

    const queryDate = date ? new Date(date) : new Date();
    queryDate.setHours(0, 0, 0, 0);

    const students = await StudentProfile.find({ currentClass: classRoomId, status: 'Active' })
      .sort({ rollNumber: 1 });

    const attendanceRecord = await Attendance.findOne({
      classRoom: classRoomId,
      date: queryDate,
    });

    const recordMap = {};
    if (attendanceRecord) {
      attendanceRecord.records.forEach((r) => {
        recordMap[r.student.toString()] = r;
      });
    }

    const roster = students.map((s) => ({
      studentId: s._id,
      studentIdNumber: s.studentIdNumber,
      fullName: s.fullName,
      gender: s.gender,
      rollNumber: s.rollNumber,
      status: recordMap[s._id.toString()] ? recordMap[s._id.toString()].status : 'Present',
      remark: recordMap[s._id.toString()] ? recordMap[s._id.toString()].remark : '',
    }));

    res.status(200).json({
      success: true,
      data: {
        classRoomId,
        date: queryDate,
        roster,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.saveClassAttendance = async (req, res, next) => {
  try {
    const { classRoomId, date, records } = req.body;
    const queryDate = date ? new Date(date) : new Date();
    queryDate.setHours(0, 0, 0, 0);

    const currentYear = await AcademicYear.findOne({ isCurrent: true });

    const attendance = await Attendance.findOneAndUpdate(
      { classRoom: classRoomId, date: queryDate },
      {
        classRoom: classRoomId,
        date: queryDate,
        academicYear: currentYear ? currentYear._id : null,
        records: records.map((r) => ({
          student: r.studentId,
          status: r.status,
          remark: r.remark || '',
        })),
        recordedBy: req.user._id,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({
      success: true,
      message: 'Attendance saved successfully!',
      data: attendance,
    });
  } catch (error) {
    next(error);
  }
};

// --- Lesson Plans ---
exports.getLessonPlans = async (req, res, next) => {
  try {
    const { classRoomId, subjectId } = req.query;
    const query = {};
    if (classRoomId) query.classRoom = classRoomId;
    if (subjectId) query.subject = subjectId;

    const plans = await LessonPlan.find(query)
      .populate('teacher', 'fullName')
      .populate('classRoom', 'name')
      .populate('subject', 'name code')
      .sort({ weekNumber: -1 });

    res.status(200).json({ success: true, count: plans.length, data: plans });
  } catch (error) {
    next(error);
  }
};

exports.createLessonPlan = async (req, res, next) => {
  try {
    const plan = await LessonPlan.create({
      ...req.body,
      teacher: req.user._id,
    });
    res.status(201).json({ success: true, data: plan });
  } catch (error) {
    next(error);
  }
};

exports.updateLessonPlanStatus = async (req, res, next) => {
  try {
    const { status, directorFeedback } = req.body;
    const plan = await LessonPlan.findByIdAndUpdate(
      req.params.id,
      { status, directorFeedback },
      { new: true }
    );
    res.status(200).json({ success: true, data: plan });
  } catch (error) {
    next(error);
  }
};

// --- Timetable ---
exports.getTimeTable = async (req, res, next) => {
  try {
    const { classRoomId } = req.params;
    let timetable = await TimeTable.findOne({ classRoom: classRoomId })
      .populate('schedule.periods.subject')
      .populate('schedule.periods.teacher', 'fullName');

    res.status(200).json({ success: true, data: timetable });
  } catch (error) {
    next(error);
  }
};

// --- Assets ---
exports.getAssets = async (req, res, next) => {
  try {
    const assets = await AssetItem.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: assets.length, data: assets });
  } catch (error) {
    next(error);
  }
};

exports.createAsset = async (req, res, next) => {
  try {
    const asset = await AssetItem.create(req.body);
    res.status(201).json({ success: true, data: asset });
  } catch (error) {
    next(error);
  }
};
