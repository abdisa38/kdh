import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import api from '../../services/api';
import {
  FileSpreadsheet,
  Printer,
  RefreshCw,
  Award,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
  GraduationCap,
} from 'lucide-react';

const MasterSheetPage = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [semester, setSemester] = useState('Semester 1');
  const [sheetData, setSheetData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await api.get('/academic/classes');
        if (res.data?.success && res.data.data.length > 0) {
          setClasses(res.data.data);
          setSelectedClass(res.data.data[0]._id);
        }
      } catch (err) {
        console.error('Error:', err);
      }
    };
    fetchClasses();
  }, []);

  const loadMasterSheet = async () => {
    if (!selectedClass) return;
    setLoading(true);
    try {
      const res = await api.get(
        `/reports/master-sheet?classRoomId=${selectedClass}&semester=${semester}`
      );
      if (res.data?.success) {
        setSheetData(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching master sheet:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedClass) {
      loadMasterSheet();
    }
  }, [selectedClass, semester]);

  const handleRecalculate = async () => {
    if (!selectedClass) return;
    setCalculating(true);
    setMessage('');
    try {
      const res = await api.post('/reports/calculate-ranking', {
        classRoomId: selectedClass,
        semester,
      });

      if (res.data?.success) {
        setMessage(`Master rankings updated for ${res.data.data.totalStudents} students.`);
        await loadMasterSheet();
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setCalculating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const subjects = sheetData?.subjects || [];
  const rows = sheetData?.rows || [];
  const classRoom = sheetData?.classRoom;

  return (
    <DashboardLayout
      title="Master Mark Sheet (ማስተር ሺት)"
      subtitle="Complete Classroom Academic Matrix, Subject Scores, Total Points & Rank Roster"
    >
      <div className="space-y-6">
        {/* Controls Bar (no-print) */}
        <div className="no-print bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="w-full sm:w-60">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Classroom Section
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-school-600"
              >
                {classes.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} (Grade {c.gradeLevel} - {c.section})
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full sm:w-44">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Term / Semester
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-school-600"
              >
                <option value="Semester 1">Semester 1 (ወሰነ-ትምህርት 1)</option>
                <option value="Semester 2">Semester 2 (ወሰነ-ትምህርት 2)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleRecalculate}
              disabled={calculating}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${calculating ? 'animate-spin' : ''}`} />
              <span>Recalculate Ranks</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-none px-5 py-2.5 bg-school-900 hover:bg-school-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow cursor-pointer"
            >
              <Printer className="w-4 h-4 text-gold-400" />
              <span>Print Master Sheet</span>
            </button>
          </div>
        </div>

        {message && (
          <div className="no-print p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{message}</span>
          </div>
        )}

        {/* Master Sheet Document */}
        <div className="bg-white rounded-2xl border-2 border-slate-800 p-6 sm:p-8 shadow-md print:border-none print:p-0 print:shadow-none text-slate-900 font-sans">
          {/* Header */}
          <div className="text-center border-b-2 border-slate-800 pb-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <div className="w-12 h-12 border border-slate-800 rounded-lg flex items-center justify-center bg-slate-50">
                <GraduationCap className="w-7 h-7 text-school-900" />
              </div>
              <div>
                <h1 className="text-xl font-black uppercase tracking-tight text-slate-950">
                  KARADIBAYU PRIMARY SCHOOL • ካራዲባዩ አንደኛ ደረጃ ትምህርት ቤት
                </h1>
                <h2 className="text-sm font-bold text-school-900 uppercase tracking-wider mt-0.5">
                  Official Master Mark Sheet (አጠቃላይ የውጤት መመዝገቢያ ማስተር ሺት)
                </h2>
              </div>
              <div className="text-right text-[11px] font-bold text-slate-600">
                <div>Academic: {sheetData?.academicYear?.name || '2026/2018 E.C.'}</div>
                <div>{semester}</div>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs font-semibold text-slate-700 pt-2 border-t border-slate-200">
              <span>
                Class: <strong className="text-slate-950">{classRoom?.name}</strong>
              </span>
              <span>
                Homeroom Teacher:{' '}
                <strong className="text-slate-950">
                  {classRoom?.homeRoomTeacher?.fullName || 'Assigned Staff'}
                </strong>
              </span>
              <span>
                Total Students: <strong className="text-slate-950">{rows.length}</strong>
              </span>
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <Loader2 className="w-8 h-8 text-school-700 animate-spin mx-auto mb-2" />
              <p className="text-xs text-slate-600">Loading master mark sheet...</p>
            </div>
          ) : rows.length === 0 ? (
            <div className="py-20 text-center text-slate-500 text-xs">
              No students recorded in this class.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-slate-400 text-[11px]">
                <thead>
                  <tr className="bg-slate-800 text-white text-center font-bold">
                    <th className="border border-slate-400 p-2 w-8">#</th>
                    <th className="border border-slate-400 p-2 w-28 text-left">Student ID</th>
                    <th className="border border-slate-400 p-2 min-w-[140px] text-left">
                      Student Full Name
                    </th>
                    <th className="border border-slate-400 p-2 w-8">Sex</th>
                    {subjects.map((s) => (
                      <th
                        key={s._id}
                        className="border border-slate-400 p-1.5 w-14 font-semibold text-[10px]"
                        title={s.name}
                      >
                        {s.code}
                      </th>
                    ))}
                    <th className="border border-slate-400 p-2 w-16 bg-school-900 text-white">
                      Total
                    </th>
                    <th className="border border-slate-400 p-2 w-14 bg-slate-900 text-white">
                      Avg%
                    </th>
                    <th className="border border-slate-400 p-2 w-12 bg-gold-600 text-white">
                      Rank
                    </th>
                    <th className="border border-slate-400 p-2 w-10">Cond</th>
                    <th className="border border-slate-400 p-2 w-20">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, idx) => (
                    <tr
                      key={r.studentId}
                      className={
                        idx % 2 === 0 ? 'bg-white' : 'bg-slate-50 hover:bg-slate-100 transition-colors'
                      }
                    >
                      <td className="border border-slate-300 p-2 text-center text-slate-500 font-semibold">
                        {idx + 1}
                      </td>
                      <td className="border border-slate-300 p-2 font-mono font-bold text-school-900">
                        {r.studentIdNumber}
                      </td>
                      <td className="border border-slate-300 p-2 font-bold text-slate-900 truncate">
                        {r.fullName}
                      </td>
                      <td className="border border-slate-300 p-2 text-center font-medium text-slate-600">
                        {r.gender === 'Male' ? 'M' : 'F'}
                      </td>

                      {/* Subject Marks */}
                      {subjects.map((s) => (
                        <td
                          key={s._id}
                          className="border border-slate-300 p-1.5 text-center font-bold text-slate-800"
                        >
                          {r.subjectScores[s._id.toString()]}
                        </td>
                      ))}

                      {/* Total */}
                      <td className="border border-slate-300 p-2 text-center font-black text-school-950 bg-school-50">
                        {r.totalMarks}
                      </td>

                      {/* Average */}
                      <td className="border border-slate-300 p-2 text-center font-black text-emerald-900 bg-emerald-50">
                        {r.average}%
                      </td>

                      {/* Rank */}
                      <td className="border border-slate-300 p-2 text-center font-black text-slate-950 bg-amber-50">
                        {r.rank === 1
                          ? '1st'
                          : r.rank === 2
                          ? '2nd'
                          : r.rank === 3
                          ? '3rd'
                          : r.rank}
                      </td>

                      {/* Conduct */}
                      <td className="border border-slate-300 p-2 text-center font-bold text-emerald-700">
                        {r.conduct}
                      </td>

                      {/* Status */}
                      <td className="border border-slate-300 p-2 text-center">
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            r.status === 'Promoted'
                              ? 'bg-emerald-100 text-emerald-800'
                              : r.status === 'Promoted with Warning'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Document Footer Signatures for Master Sheet */}
          <div className="border-t-2 border-slate-800 pt-6 mt-8 grid grid-cols-3 gap-6 text-center text-xs">
            <div>
              <div className="h-10 border-b border-slate-400 mb-1 flex items-end justify-center font-serif italic text-slate-700">
                A. Awel
              </div>
              <span className="font-bold text-slate-900 block">Homeroom Teacher Signature</span>
              <span className="text-[10px] text-slate-500">የክፍል ኃላፊ መምህር</span>
            </div>

            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full border border-dashed border-school-800 flex items-center justify-center text-[8px] text-school-900 font-bold uppercase text-center">
                OFFICIAL SEAL
              </div>
            </div>

            <div>
              <div className="h-10 border-b border-slate-400 mb-1 flex items-end justify-center font-serif italic text-slate-700">
                Alemayehu T.
              </div>
              <span className="font-bold text-slate-900 block">School Director / Principal</span>
              <span className="text-[10px] text-slate-500">የርዕሰ መምህር ማረጋገጫ</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MasterSheetPage;
