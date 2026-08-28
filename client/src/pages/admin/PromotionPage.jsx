import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import api from '../../services/api';
import {
  Compass,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Loader2,
  Award,
  ArrowRight,
} from 'lucide-react';

const PromotionPage = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [semester, setSemester] = useState('Semester 1');
  const [rankingData, setRankingData] = useState([]);
  const [loading, setLoading] = useState(false);
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

  const loadRankings = async () => {
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
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedClass) {
      loadRankings();
    }
  }, [selectedClass, semester]);

  const handlePromoteBatch = () => {
    setMessage(
      'Academic Promotion & Grade Rollover simulated successfully. Promoted students eligible for advancement.'
    );
  };

  return (
    <DashboardLayout
      title="Academic Progression & Promotion (የክፍል ማለፊያና ደረጃ ዝውውር)"
      subtitle="End of academic year pass/fail progression and promotion rollover"
    >
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="w-60">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Classroom Section
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
              >
                {classes.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handlePromoteBatch}
            className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>Process End-of-Term Promotion</span>
          </button>
        </div>

        {message && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{message}</span>
          </div>
        )}

        {/* Promotion Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-900 text-white flex justify-between items-center text-xs">
            <div className="flex items-center gap-2 font-bold">
              <Compass className="w-4 h-4 text-amber-400" />
              <span>Student Pass / Fail Progression Standing</span>
            </div>
            <span className="text-slate-400 font-semibold">{rankingData.length} Students</span>
          </div>

          {loading ? (
            <div className="py-24 text-center">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
              <p className="text-xs text-slate-500 font-medium">Loading promotion records...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                    <th className="p-3.5 w-16 text-center">Rank</th>
                    <th className="p-3.5 w-32">Admission ID</th>
                    <th className="p-3.5">Student Full Name</th>
                    <th className="p-3.5 w-28 text-center">Total Points</th>
                    <th className="p-3.5 w-28 text-center bg-blue-50/60 text-blue-900">Average %</th>
                    <th className="p-3.5 w-44 text-center">Promotion Decision</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rankingData.map((row) => (
                    <tr key={row.studentId} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3.5 text-center font-black text-slate-900">
                        {row.rank === 1
                          ? '1st'
                          : row.rank === 2
                          ? '2nd'
                          : row.rank === 3
                          ? '3rd'
                          : row.rank}
                      </td>
                      <td className="p-3.5 font-mono font-bold text-slate-800">
                        {row.studentIdNumber}
                      </td>
                      <td className="p-3.5 font-bold text-slate-900">{row.fullName}</td>
                      <td className="p-3.5 text-center font-bold text-slate-800">
                        {row.totalMarks}
                      </td>
                      <td className="p-3.5 text-center font-black text-sm text-blue-700 bg-blue-50/40">
                        {row.average}%
                      </td>
                      <td className="p-3.5 text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                            row.status.includes('Promoted') || row.status.includes('ያለፈ')
                              ? 'bg-emerald-100 text-emerald-800'
                              : row.status.includes('Warning') || row.status.includes('በማስጠንቀቂያ')
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

export default PromotionPage;
