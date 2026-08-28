const StudentProfile = require('../models/StudentProfile');
const MarkRecord = require('../models/MarkRecord');
const ReportCard = require('../models/ReportCard');
const Subject = require('../models/Subject');

/**
 * Calculates student ranks, averages, totals and updates ReportCard records for a class & semester
 */
const calculateClassRankings = async (classRoomId, academicYearId, semester) => {
  // 1. Fetch all active students in the class
  const students = await StudentProfile.find({
    currentClass: classRoomId,
    status: 'Active',
  }).populate('user', 'fullName');

  if (!students || students.length === 0) {
    return { success: false, message: 'No students found in this class.' };
  }

  const studentSummaries = [];

  // 2. Fetch marks for each student
  for (const student of students) {
    const marks = await MarkRecord.find({
      student: student._id,
      academicYear: academicYearId,
      semester: semester,
    }).populate('subject', 'name nameAmharic code passMark');

    let totalMarks = 0;
    let failedCount = 0;
    const subjectRecords = [];

    marks.forEach((m) => {
      const subject = m.subject;
      if (!subject) return;

      const totalScore = m.totalScore || 0;
      totalMarks += totalScore;
      const isPassed = totalScore >= (subject.passMark || 50);
      if (!isPassed) failedCount++;

      subjectRecords.push({
        subject: subject._id,
        subjectName: subject.name,
        subjectNameAmharic: subject.nameAmharic || subject.name,
        caScore: m.assessments ? m.assessments.totalCA || 0 : 0,
        finalExamScore: m.finalExam || 0,
        totalScore: totalScore,
        passMark: subject.passMark || 50,
        isPassed: isPassed,
      });
    });

    const subjectCount = subjectRecords.length > 0 ? subjectRecords.length : 1;
    const average = Math.round((totalMarks / subjectCount) * 100) / 100;
    const maxPossibleMarks = subjectCount * 100;

    let status = 'ያለፈ (Promoted)';
    if (average < 50 || failedCount >= 3) {
      status = 'የደገመ (Retained)';
    } else if (failedCount > 0) {
      status = 'በማስጠንቀቂያ ያለፈ (Warning)';
    }

    studentSummaries.push({
      studentId: student._id,
      studentProfile: student,
      totalMarks,
      average,
      maxPossibleMarks,
      subjectRecords,
      status,
    });
  }

  // 3. Sort students by Average descending (tie-break with totalMarks)
  studentSummaries.sort((a, b) => {
    if (b.average !== a.average) {
      return b.average - a.average;
    }
    return b.totalMarks - a.totalMarks;
  });

  // 4. Assign ranks (handling ties)
  for (let i = 0; i < studentSummaries.length; i++) {
    if (i > 0) {
      const prev = studentSummaries[i - 1];
      const curr = studentSummaries[i];
      if (curr.average === prev.average && curr.totalMarks === prev.totalMarks) {
        studentSummaries[i].rank = studentSummaries[i - 1].rank;
      } else {
        studentSummaries[i].rank = i + 1;
      }
    } else {
      studentSummaries[i].rank = 1;
    }
  }

  // 5. Update or Create ReportCard documents
  const reportCards = [];
  for (const summary of studentSummaries) {
    const reportCard = await ReportCard.findOneAndUpdate(
      {
        student: summary.studentId,
        academicYear: academicYearId,
        semester: semester,
      },
      {
        student: summary.studentId,
        academicYear: academicYearId,
        semester: semester,
        classRoom: classRoomId,
        subjectRecords: summary.subjectRecords,
        totalMarks: summary.totalMarks,
        maxPossibleMarks: summary.maxPossibleMarks,
        average: summary.average,
        rank: summary.rank,
        totalStudentsInClass: studentSummaries.length,
        status: summary.status,
        isPublished: true,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    reportCards.push(reportCard);
  }

  return {
    success: true,
    totalStudents: studentSummaries.length,
    rankedList: studentSummaries.map((s) => ({
      studentId: s.studentId,
      studentName: s.studentProfile.fullName,
      studentIdNumber: s.studentProfile.studentIdNumber,
      totalMarks: s.totalMarks,
      average: s.average,
      rank: s.rank,
      status: s.status,
    })),
  };
};

module.exports = { calculateClassRankings };
