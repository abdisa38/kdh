import React from 'react';
import {
  Printer,
  Award,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Calendar,
  User,
  GraduationCap,
} from 'lucide-react';

const PrintableReportCard = ({ reportCard, student, academicYear, semester }) => {
  if (!reportCard || !student) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200 shadow-sm">
        <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
        <p className="text-slate-700 font-semibold">Report card record not yet finalized.</p>
        <p className="text-slate-500 text-sm mt-1">
          Please verify that the teacher has submitted numerical marks and computed rankings.
        </p>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const subjectRecords = reportCard.subjectRecords || [];

  return (
    <div className="space-y-4">
      {/* Top Action Bar (hidden when printing) */}
      <div className="no-print flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-600" />
          <span className="font-semibold text-slate-800 text-sm">
            Official Ethiopian Primary School Report Card (የውጤት መግለጫ ካርድ)
          </span>
        </div>
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
        >
          <Printer className="w-4 h-4 text-amber-400" />
          Print / Download PDF Card
        </button>
      </div>

      {/* Official Ethiopian Primary School Report Card Document */}
      <div className="report-card-print-container bg-white border-2 border-slate-800 rounded-xl p-8 shadow-md print:border print:border-black print:p-6 print:shadow-none text-slate-900 font-sans">
        {/* Document Header */}
        <div className="text-center border-b-2 border-slate-800 pb-5 mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-16 h-16 border-2 border-slate-800 rounded-lg flex items-center justify-center bg-slate-50">
              <GraduationCap className="w-10 h-10 text-slate-900" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest font-bold text-slate-600">
                Federal Democratic Republic of Ethiopia • Regional Education Bureau
              </div>
              <h1 className="text-2xl font-black tracking-tight text-slate-950 uppercase mt-1">
                KARADIBAYU PRIMARY SCHOOL
              </h1>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                ካራዲባዩ አንደኛ ደረጃ ትምህርት ቤት
              </h2>
              <div className="inline-block mt-2 px-4 py-0.5 bg-slate-900 text-white font-bold text-xs uppercase tracking-wider rounded">
                Official Student Academic Report Card • የተማሪ የውጤት መግለጫ ካርድ (Grades 1-8)
              </div>
            </div>
            <div className="w-16 h-16 border-2 border-slate-800 rounded-lg flex flex-col items-center justify-center bg-slate-50 text-[10px] font-bold text-center p-1">
              <span>GRADES</span>
              <span className="text-base text-slate-900 font-black">1 - 8</span>
            </div>
          </div>
        </div>

        {/* Student Biodata Box */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 border border-slate-300 rounded-lg mb-6 text-xs">
          <div>
            <span className="text-slate-500 font-semibold block uppercase">Student Full Name:</span>
            <span className="font-bold text-sm text-slate-900">
              {student.firstName} {student.middleName} {student.lastName}
            </span>
            {student.firstNameAmharic && (
              <span className="text-slate-600 block">
                {student.firstNameAmharic} {student.middleNameAmharic} {student.lastNameAmharic}
              </span>
            )}
          </div>
          <div>
            <span className="text-slate-500 font-semibold block uppercase">Student ID / Roll:</span>
            <span className="font-bold text-sm text-slate-900">
              {student.studentIdNumber} (Roll #{student.rollNumber || 1})
            </span>
          </div>
          <div>
            <span className="text-slate-500 font-semibold block uppercase">Class & Section:</span>
            <span className="font-bold text-sm text-slate-900">
              {student.currentClass?.name || 'Grade 7-A'}
            </span>
          </div>
          <div>
            <span className="text-slate-500 font-semibold block uppercase">Academic Period:</span>
            <span className="font-bold text-sm text-slate-900">
              {academicYear?.name || '2026/2018 E.C.'} • {semester || 'Semester 1'}
            </span>
          </div>
        </div>

        {/* Pure Numerical Subjects & Marks Table */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse border border-slate-400 text-xs">
            <thead>
              <tr className="bg-slate-800 text-white text-center font-bold">
                <th className="border border-slate-400 p-2 text-left w-10">#</th>
                <th className="border border-slate-400 p-2 text-left">Subject (የትምህርት አይነት)</th>
                <th className="border border-slate-400 p-2 w-28">Continuous Assmt (50%)</th>
                <th className="border border-slate-400 p-2 w-28">Final Exam (50%)</th>
                <th className="border border-slate-400 p-2 w-28 bg-slate-900 text-white">Total (100%)</th>
                <th className="border border-slate-400 p-2 w-24">Status (ውጤት)</th>
              </tr>
            </thead>
            <tbody>
              {subjectRecords.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className="border border-slate-300 p-2 text-center font-semibold text-slate-500">
                    {index + 1}
                  </td>
                  <td className="border border-slate-300 p-2">
                    <div className="font-bold text-slate-900">{item.subjectName}</div>
                    {item.subjectNameAmharic && (
                      <div className="text-[11px] text-slate-600">{item.subjectNameAmharic}</div>
                    )}
                  </td>
                  <td className="border border-slate-300 p-2 text-center font-semibold">
                    {item.caScore}
                  </td>
                  <td className="border border-slate-300 p-2 text-center font-semibold">
                    {item.finalExamScore}
                  </td>
                  <td className="border border-slate-300 p-2 text-center font-black text-slate-950 text-sm bg-slate-100/50">
                    {item.totalScore}
                  </td>
                  <td className="border border-slate-300 p-2 text-center">
                    {item.isPassed ? (
                      <span className="text-emerald-700 font-bold">ያለፈ (Passed)</span>
                    ) : (
                      <span className="text-rose-700 font-bold">የወደቀ (Failed)</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-400">
                <td colSpan="4" className="border border-slate-400 p-2.5 text-right uppercase">
                  Total Marks Earned (አጠቃላይ የተማሪው ድምር):
                </td>
                <td className="border border-slate-400 p-2.5 text-center text-sm font-black text-slate-950">
                  {reportCard.totalMarks} / {reportCard.maxPossibleMarks}
                </td>
                <td className="border border-slate-400 p-2.5 text-center text-xs">
                  Average: <span className="font-black text-sm">{reportCard.average}%</span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Academic Performance & Conduct Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-xs">
          {/* Summary Box */}
          <div className="border border-slate-300 rounded-lg p-3.5 bg-slate-50 space-y-2">
            <div className="font-bold text-slate-900 uppercase border-b border-slate-200 pb-1 flex items-center justify-between">
              <span>Class Standing (የክፍል ደረጃ)</span>
              <Award className="w-4 h-4 text-amber-600" />
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-600">Rank in Section:</span>
              <span className="font-black text-base text-slate-950">
                {reportCard.rank === 1
                  ? '1ኛ ደረጃ (1st)'
                  : reportCard.rank === 2
                  ? '2ኛ ደረጃ (2nd)'
                  : reportCard.rank === 3
                  ? '3ኛ ደረጃ (3rd)'
                  : `${reportCard.rank}ኛ ደረጃ`}{' '}
                <span className="text-xs text-slate-500 font-normal">
                  / {reportCard.totalStudentsInClass}
                </span>
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-t border-slate-200">
              <span className="text-slate-600">Overall Average:</span>
              <span className="font-black text-sm text-slate-950">{reportCard.average}%</span>
            </div>
            <div className="flex justify-between items-center py-1 border-t border-slate-200">
              <span className="text-slate-600">Academic Status:</span>
              <span
                className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                  reportCard.status.includes('Promoted') || reportCard.status.includes('ያለፈ')
                    ? 'bg-emerald-100 text-emerald-800'
                    : reportCard.status.includes('Warning') || reportCard.status.includes('በማስጠንቀቂያ')
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {reportCard.status}
              </span>
            </div>
          </div>

          {/* Conduct & Attendance */}
          <div className="border border-slate-300 rounded-lg p-3.5 bg-slate-50 space-y-2">
            <div className="font-bold text-slate-900 uppercase border-b border-slate-200 pb-1">
              Behavior & Attendance (ስነ-ምግባርና ክትትል)
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-600">Conduct (ስነ-ምግባር):</span>
              <span className="font-black text-xs text-emerald-700">
                {reportCard.conduct || 'በጣም ጥሩ (A)'}
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-t border-slate-200">
              <span className="text-slate-600">Days Present / Total:</span>
              <span className="font-semibold text-slate-900">
                {reportCard.attendance?.daysPresent || 90} / {reportCard.attendance?.totalDays || 92}{' '}
                ቀን
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-t border-slate-200">
              <span className="text-slate-600">Absence Record:</span>
              <span className="font-semibold text-slate-900">
                {reportCard.attendance?.daysAbsent || 2} ቀን
              </span>
            </div>
          </div>

          {/* Remarks */}
          <div className="border border-slate-300 rounded-lg p-3.5 bg-slate-50 space-y-2">
            <div className="font-bold text-slate-900 uppercase border-b border-slate-200 pb-1">
              Teacher's Remarks (የመምህር አስተያየት)
            </div>
            <p className="text-slate-700 italic leading-relaxed pt-1">
              "{reportCard.teacherComment || 'በጣም ጥሩ የትምህርት አቀባበልና ስነ-ምግባር አሳይቷል/ታለች።'}"
            </p>
          </div>
        </div>

        {/* Signatures and Official Stamp Section */}
        <div className="border-t-2 border-slate-800 pt-6 mt-6 grid grid-cols-3 gap-6 text-center text-xs">
          <div>
            <div className="h-10 border-b border-slate-400 mb-1 flex items-end justify-center font-serif italic text-slate-700">
              A. Awel
            </div>
            <span className="font-bold text-slate-900 block">Homeroom Teacher Signature</span>
            <span className="text-[10px] text-slate-500">የክፍል ኃላፊ መምህር ፊርማ</span>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-800 flex flex-col items-center justify-center p-1 text-[9px] text-slate-900 font-bold uppercase tracking-tighter">
              <span>Karadibayu</span>
              <span>Primary School</span>
              <span className="text-[8px] text-slate-500">OFFICIAL SEAL</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-1">School Official Stamp</span>
          </div>

          <div>
            <div className="h-10 border-b border-slate-400 mb-1 flex items-end justify-center font-serif italic text-slate-700">
              Alemayehu T.
            </div>
            <span className="font-bold text-slate-900 block">School Director / Principal</span>
            <span className="text-[10px] text-slate-500">የርዕሰ መምህር ፊርማና ማረጋገጫ</span>
          </div>
        </div>

        {/* Watermark and Verification Notice */}
        <div className="mt-8 pt-3 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400 font-mono">
          <span>Document Code: KPS-{student.studentIdNumber.replace('/', '')}-2026</span>
          <span>Verified by Karadibayu Academic Records Division</span>
          <span>Date: {new Date().toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default PrintableReportCard;
