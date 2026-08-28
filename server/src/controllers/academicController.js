const AcademicYear = require('../models/AcademicYear');
const ClassRoom = require('../models/ClassRoom');
const Subject = require('../models/Subject');

// --- Academic Years ---
exports.getAcademicYears = async (req, res, next) => {
  try {
    const years = await AcademicYear.find().sort({ gregorianYear: -1 });
    res.status(200).json({ success: true, data: years });
  } catch (error) {
    next(error);
  }
};

exports.createAcademicYear = async (req, res, next) => {
  try {
    const { name, ethiopianYear, gregorianYear, isCurrent, semesters } = req.body;
    if (isCurrent) {
      await AcademicYear.updateMany({}, { isCurrent: false });
    }
    const year = await AcademicYear.create({
      name,
      ethiopianYear: ethiopianYear || 2018,
      gregorianYear: gregorianYear || 2026,
      isCurrent: !!isCurrent,
      semesters: semesters || [
        { name: 'Semester 1', nameAmharic: 'የመጀመሪያ ወሰነ-ትምህርት', isCurrent: true },
        { name: 'Semester 2', nameAmharic: 'የሁለተኛ ወሰነ-ትምህርት', isCurrent: false },
      ],
    });
    res.status(201).json({ success: true, data: year });
  } catch (error) {
    next(error);
  }
};

// --- ClassRooms ---
exports.getClassRooms = async (req, res, next) => {
  try {
    const { gradeLevel } = req.query;
    const query = {};
    if (gradeLevel) query.gradeLevel = gradeLevel;

    const classes = await ClassRoom.find(query)
      .populate('academicYear')
      .populate('homeRoomTeacher', 'fullName username')
      .sort({ gradeLevel: 1, section: 1 });

    res.status(200).json({ success: true, count: classes.length, data: classes });
  } catch (error) {
    next(error);
  }
};

exports.createClassRoom = async (req, res, next) => {
  try {
    const { gradeLevel, section, academicYear, homeRoomTeacher, roomNumber, capacity } = req.body;
    const name = `Grade ${gradeLevel} - Section ${section.toUpperCase()}`;

    const classRoom = await ClassRoom.create({
      gradeLevel,
      section: section.toUpperCase(),
      name,
      academicYear,
      homeRoomTeacher,
      roomNumber,
      capacity,
    });

    res.status(201).json({ success: true, data: classRoom });
  } catch (error) {
    next(error);
  }
};

// --- Subjects ---
exports.getSubjects = async (req, res, next) => {
  try {
    const { gradeLevel } = req.query;
    const query = { isActive: true };
    if (gradeLevel) query.gradeLevel = gradeLevel;

    const subjects = await Subject.find(query).sort({ gradeLevel: 1, code: 1 });
    res.status(200).json({ success: true, count: subjects.length, data: subjects });
  } catch (error) {
    next(error);
  }
};

exports.createSubject = async (req, res, next) => {
  try {
    const { name, nameAmharic, code, gradeLevel, category, passMark } = req.body;

    const subject = await Subject.create({
      name,
      nameAmharic,
      code: code.toUpperCase(),
      gradeLevel,
      category,
      passMark: passMark || 50,
    });

    res.status(201).json({ success: true, data: subject });
  } catch (error) {
    next(error);
  }
};
