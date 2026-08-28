import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import api from '../../services/api';
import {
  Award,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  UserCheck,
  TrendingUp,
  FileSpreadsheet,
} from 'lucide-react';

const ClassRankingPage = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [semester, setSemester] = useState('Semester 1');
  const [rankingData, setRankingData] = useState([]);
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
        console.error('Error fetching classes:', err);
      }
    };
    fetchClasses();
  }, []);

  const loadRankingList = async () => {
    if (!selectedClass) return;
    setLoading(true);
    try {
      const res = await api.get(
        `/reports/master-sheet?classRoomId=${selectedClass}&semester=${semester}`
      );
      if (res.data?.success) {
        setRankingData(res.data.data.rows || []);
      }
    } catch (err) {
      console.error('Error fetching rankings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedClass) {
      loadRankingList();
    }
  }, [selectedClass, semester]);

  const handleComputeRanking = async () => {
    if (!selectedClass) return;
    setCalculating(true);
    setMessage('');
    try {
      const res = await api.post('/reports/calculate-ranking', {
        classRoomId: selectedClass,
        semester,
      });

      if (res.data?.success) {
        setMessage(`Class ranking computed successfully for ${res.data.data.totalStudents} students.`);
        await loadRankingList();
      }
    } catch (err) {
      console.error('Error computing rankings:', err);
    } finally {
      setCalculating(false);
    }
  };

  return (
    <DashboardLayout
      title="Class Academic Ranking & Conduct Evaluation"
      subtitle="Automated Grade Aggregator, Average, and Section Standing (የተማሪዎች ደረጃና አማካይ አሰላለፍ)"
    >
      <div className="space-y-6">
        {/* Control Bar */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="w-full sm:w-60">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Classroom / Section
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
                <option value="Semester 1">Semester 1 (ወሰነ 1)</option>
                <option value="Semester 2">Semester 2 (ወሰነ 2)</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleComputeRanking}
            disabled={calculating}
            className="w-full sm:w-auto px-5 py-2.5 bg-school-900 hover:bg-school-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow cursor-pointer disabled:opacity-50"
          >
            {calculating ? (
              <Loader2 className="w-4 h-4 animate-spin text-gold-400" />
            ) : (
              <RefreshCw className="w-4 h-4 text-gold-400" />
            )}
            <span>Compute & Lock Rankings</span>
          </button>
        </div>

        {message && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{message}</span>
          </div>
        )}

        {/* Ranking Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-900 text-white flex justify-between items-center text-xs">
            <div className="flex items-center gap-2 font-bold">
              <Award className="w-4 h-4 text-gold-400" />
              <span>Section Ranking Order • Sorted by Highest Average</span>
            </div>
            <span className="text-slate-400">{rankingData.length} Students</span>
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <Loader2 className="w-8 h-8 text-school-700 animate-spin mx-auto mb-2" />
              <p className="text-xs text-slate-600">Loading ranking standings...</p>
            </div>
          ) : rankingData.length === 0 ? (
            <div className="py-20 text-center text-slate-500 text-xs">
              No students recorded in this class.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                    <th className="p-3 w-16 text-center">Rank</th>
                    <th className="p-3 w-32">Student ID</th>
                    <th className="p-3">Full Student Name</th>
                    <th className="p-3 w-20 text-center">Gender</th>
                    <th className="p-3 w-28 text-center bg-school-50 text-school-900">Total Marks</th>
                    <th className="p-3 w-28 text-center bg-emerald-50 text-emerald-950">Average</th>
                    <th className="p-3 w-24 text-center">Conduct</th>
                    <th className="p-3 w-32 text-center">Promotion</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {rankingData.map((row) => (
                    <tr
                      key={row.studentId}
                      className={`hover:bg-slate-50 transition-colors ${
                        row.rank === 1
                          ? 'bg-amber-50/40 font-semibold'
                          : row.rank === 2
                          ? 'bg-slate-50/70'
                          : ''
                      }`}
                    >
                      <td className="p-3 text-center font-black text-sm">
                        {row.rank === 1 ? (
                          <span className="inline-block px-2 py-0.5 rounded bg-gold-400 text-slate-950 text-xs font-black shadow-xs">
                            1st
                          </span>
                        ) : row.rank === 2 ? (
                          <span className="inline-block px-2 py-0.5 rounded bg-slate-300 text-slate-900 text-xs font-bold">
                            2nd
                          </span>
                        ) : row.rank === 3 ? (
                          <span className="inline-block px-2 py-0.5 rounded bg-amber-200 text-amber-900 text-xs font-bold">
                            3rd
                          </span>
                        ) : (
                          <span className="text-slate-600 font-bold">{row.rank}</span>
                        )}
                      </td>
                      <td className="p-3 font-mono font-bold text-school-800">
                        {row.studentIdNumber}
                      </td>
                      <td className="p-3 font-bold text-slate-900">{row.fullName}</td>
                      <td className="p-3 text-center text-slate-600">{row.gender}</td>
                      <td className="p-3 text-center font-bold text-school-950 bg-school-50/50">
                        {row.totalMarks}
                      </td>
                      <td className="p-3 text-center font-black text-sm text-emerald-900 bg-emerald-50/50">
                        {row.average}%
                      </td>
                      <td className="p-3 text-center font-bold text-emerald-700">
                        Grade {row.conduct || 'A'}
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                            row.status === 'Promoted'
                              ? 'bg-emerald-100 text-emerald-800'
                              : row.status === 'Promoted with Warning'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {row.status}
                        </span>
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

export default ClassRankingPage;
