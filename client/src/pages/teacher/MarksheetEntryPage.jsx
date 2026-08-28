import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import api from '../../services/api';
import {
  FileSpreadsheet,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  BookOpen,
  Filter,
} from 'lucide-react';

const MarksheetEntryPage = () => {
  const [searchParams] = useSearchParams();
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [selectedClass, setSelectedClass] = useState(searchParams.get('classId') || '');
  const [selectedSubject, setSelectedSubject] = useState(searchParams.get('subjectId') || '');
  const [selectedSemester, setSelectedSemester] = useState('Semester 1');

  const [roster, setRoster] = useState([]);
  const [loadingRoster, setLoadingRoster] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [classesRes, subjectsRes] = await Promise.all([
          api.get('/academic/classes'),
          api.get('/academic/subjects'),
        ]);

        if (classesRes.data?.success) {
          setClasses(classesRes.data.data);
          if (!selectedClass && classesRes.data.data.length > 0) {
            setSelectedClass(classesRes.data.data[0]._id);
          }
        }

        if (subjectsRes.data?.success) {
          setSubjects(subjectsRes.data.data);
          if (!selectedSubject && subjectsRes.data.data.length > 0) {
            setSelectedSubject(subjectsRes.data.data[0]._id);
          }
        }
      } catch (error) {
        console.error('Error fetching dropdowns:', error);
      }
    };
    fetchDropdowns();
  }, []);

  const fetchMarksheetRoster = async () => {
    if (!selectedClass || !selectedSubject) return;

    setLoadingRoster(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await api.get(
        `/marks/roster?classRoomId=${selectedClass}&subjectId=${selectedSubject}&semester=${selectedSemester}`
      );
      if (res.data?.success) {
        setRoster(res.data.data.roster || []);
      }
    } catch (error) {
      console.error('Error fetching roster:', error);
      setMessage({
        text: 'Failed to load class roster. Please verify parameters.',
        type: 'error',
      });
    } finally {
      setLoadingRoster(false);
    }
  };

  useEffect(() => {
    if (selectedClass && selectedSubject) {
      fetchMarksheetRoster();
    }
  }, [selectedClass, selectedSubject, selectedSemester]);

  const handleScoreChange = (index, field, value) => {
    const numVal = Math.max(0, Number(value) || 0);

    setRoster((prev) => {
      const copy = [...prev];
      const student = { ...copy[index] };
      const assessments = { ...student.assessments };

      if (field === 'finalExam') {
        student.finalExam = Math.min(numVal, 50);
      } else {
        assessments[field] = numVal;
      }

      const calculatedCA =
        (assessments.quiz1 || 0) +
        (assessments.quiz2 || 0) +
        (assessments.test1 || 0) +
        (assessments.assignment || 0) +
        (assessments.midExam || 0) +
        (assessments.project || 0);

      assessments.totalCA = Math.min(calculatedCA, 50);
      student.assessments = assessments;
      student.totalScore = Math.min(assessments.totalCA + (student.finalExam || 0), 100);

      copy[index] = student;
      return copy;
    });
  };

  const handleSaveBulk = async () => {
    setSaving(true);
    setMessage({ text: '', type: '' });

    try {
      const entries = roster.map((item) => ({
        studentId: item.studentId,
        assessments: item.assessments,
        finalExam: item.finalExam,
        remarks: item.remarks,
      }));

      const res = await api.post('/marks/bulk-save', {
        classRoomId: selectedClass,
        subjectId: selectedSubject,
        semester: selectedSemester,
        entries,
      });

      if (res.data?.success) {
        setMessage({
          text: `Success! Numerical marks for ${roster.length} students recorded and saved.`,
          type: 'success',
        });
      }
    } catch (error) {
      console.error('Error saving marks:', error);
      setMessage({
        text: error.response?.data?.message || 'Error occurred while saving marks.',
        type: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout
      title="Continuous Assessment & Mark Entry (የውጤት መመዝገቢያ)"
      subtitle="Pure Numerical Mark Entry • Continuous Assessment (50%) + Final Examination (50%) = 100%"
    >
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
          <div className="sm:col-span-4">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Select Classroom Section
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
            >
              {classes.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} (Grade {c.gradeLevel} - {c.section})
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-4">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Select Subject (የትምህርት አይነት)
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
            >
              {subjects.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name} ({s.code} - {s.nameAmharic})
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Term / Semester
            </label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
            >
              <option value="Semester 1">Semester 1</option>
              <option value="Semester 2">Semester 2</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <button
              onClick={handleSaveBulk}
              disabled={saving || roster.length === 0}
              className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <Save className="w-4 h-4 text-white" />
              )}
              <span>Save Marks</span>
            </button>
          </div>
        </div>

        {message.text && (
          <div
            className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 border ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-900 text-white flex justify-between items-center text-xs">
            <div className="flex items-center gap-2 font-bold">
              <FileSpreadsheet className="w-4 h-4 text-amber-400" />
              <span>
                Ethiopian Primary Marksheet Grid • CA (50%) + Final Exam (50%) = Total Score (100%)
              </span>
            </div>
            <span className="text-slate-400 font-semibold">{roster.length} Pupils</span>
          </div>

          {loadingRoster ? (
            <div className="py-24 text-center">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
              <p className="text-xs text-slate-500 font-medium">Loading marksheet roster...</p>
            </div>
          ) : roster.length === 0 ? (
            <div className="py-20 text-center text-slate-500 text-xs">
              No students enrolled in this section.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-3 w-10">Roll</th>
                    <th className="p-3 w-28">Admission ID</th>
                    <th className="p-3 min-w-[160px]">Full Name</th>
                    <th className="p-2 w-16 text-center">Quiz 1 (5)</th>
                    <th className="p-2 w-16 text-center">Quiz 2 (5)</th>
                    <th className="p-2 w-16 text-center">Test (10)</th>
                    <th className="p-2 w-16 text-center">Assgn (10)</th>
                    <th className="p-2 w-16 text-center">Mid (20)</th>
                    <th className="p-2 w-20 text-center bg-blue-50 text-blue-900 font-bold">CA (50)</th>
                    <th className="p-2 w-20 text-center bg-amber-50 text-amber-900 font-bold">Final (50)</th>
                    <th className="p-2 w-24 text-center bg-slate-900 text-white font-bold">Total (100)</th>
                    <th className="p-2 w-24 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {roster.map((row, idx) => (
                    <tr key={row.studentId} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-semibold text-slate-500">{row.rollNumber || idx + 1}</td>
                      <td className="p-3 font-mono font-bold text-slate-800">{row.studentIdNumber}</td>
                      <td className="p-3 font-bold text-slate-900 truncate">{row.fullName}</td>

                      <td className="p-1 text-center">
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max="5"
                          value={row.assessments?.quiz1 || ''}
                          onChange={(e) => handleScoreChange(idx, 'quiz1', e.target.value)}
                          className="w-12 p-1.5 text-center bg-white border border-slate-200 rounded font-semibold focus:border-blue-600 focus:outline-none"
                        />
                      </td>

                      <td className="p-1 text-center">
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max="5"
                          value={row.assessments?.quiz2 || ''}
                          onChange={(e) => handleScoreChange(idx, 'quiz2', e.target.value)}
                          className="w-12 p-1.5 text-center bg-white border border-slate-200 rounded font-semibold focus:border-blue-600 focus:outline-none"
                        />
                      </td>

                      <td className="p-1 text-center">
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max="10"
                          value={row.assessments?.test1 || ''}
                          onChange={(e) => handleScoreChange(idx, 'test1', e.target.value)}
                          className="w-12 p-1.5 text-center bg-white border border-slate-200 rounded font-semibold focus:border-blue-600 focus:outline-none"
                        />
                      </td>

                      <td className="p-1 text-center">
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max="10"
                          value={row.assessments?.assignment || ''}
                          onChange={(e) => handleScoreChange(idx, 'assignment', e.target.value)}
                          className="w-12 p-1.5 text-center bg-white border border-slate-200 rounded font-semibold focus:border-blue-600 focus:outline-none"
                        />
                      </td>

                      <td className="p-1 text-center">
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max="20"
                          value={row.assessments?.midExam || ''}
                          onChange={(e) => handleScoreChange(idx, 'midExam', e.target.value)}
                          className="w-12 p-1.5 text-center bg-white border border-slate-200 rounded font-semibold focus:border-blue-600 focus:outline-none"
                        />
                      </td>

                      <td className="p-2 text-center font-bold bg-blue-50/70 text-blue-900">
                        {row.assessments?.totalCA || 0}
                      </td>

                      <td className="p-1 text-center bg-amber-50/40">
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max="50"
                          value={row.finalExam || ''}
                          onChange={(e) => handleScoreChange(idx, 'finalExam', e.target.value)}
                          className="w-14 p-1.5 text-center bg-white border border-amber-300 rounded font-bold text-amber-950 focus:border-blue-600 focus:outline-none"
                        />
                      </td>

                      <td className="p-2 text-center font-black text-sm bg-slate-900 text-white">
                        {row.totalScore || 0}
                      </td>

                      <td className="p-2 text-center">
                        {row.totalScore >= 50 ? (
                          <span className="text-[11px] font-bold text-emerald-700">ያለፈ</span>
                        ) : (
                          <span className="text-[11px] font-bold text-rose-700">የወደቀ</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MarksheetEntryPage;
