import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../../services/api';
import PrintableReportCard from '../../components/report/PrintableReportCard';
import {
  Search,
  Award,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
  User,
  GraduationCap,
  ShieldCheck,
} from 'lucide-react';

const PublicResultCheckerPage = () => {
  const [searchParams] = useSearchParams();
  const [studentId, setStudentId] = useState(searchParams.get('id') || '');
  const [semester, setSemester] = useState('Semester 1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resultData, setResultData] = useState(null);

  const fetchResults = async (idToSearch, sem) => {
    if (!idToSearch.trim()) return;
    setLoading(true);
    setError('');
    setResultData(null);

    try {
      const res = await api.post('/students/public/search-result', {
        studentIdNumber: idToSearch.trim().toUpperCase(),
        semester: sem,
      });

      if (res.data?.success) {
        setResultData(res.data.data);
      } else {
        setError(res.data?.message || 'No result found for this Student ID.');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Unable to find student results. Please verify the Student ID number.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const idFromQuery = searchParams.get('id');
    if (idFromQuery) {
      setStudentId(idFromQuery);
      fetchResults(idFromQuery, semester);
    }
  }, [searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchResults(studentId, semester);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-school-950 text-white rounded-2xl p-6 sm:p-10 border border-school-900 shadow-md">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-school-900 border border-school-800 text-gold-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Official Examination Verification</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Student Mark & Report Card Lookup
          </h1>
          <p className="text-sm text-slate-300 mt-2">
            Enter your official Student ID Number (e.g. <span className="text-gold-400 font-mono font-bold">KPS/2026/001</span>) to access your continuous assessment breakdown, final examination scores, and printable semester report card.
          </p>
        </div>

        {/* Search Form Bar */}
        <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Student ID Number
            </label>
            <input
              type="text"
              placeholder="e.g. KPS/2026/001"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full px-4 py-2.5 bg-school-900 border border-school-700 rounded-xl text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-school-400 uppercase"
              required
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Academic Term
            </label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full px-3 py-2.5 bg-school-900 border border-school-700 rounded-xl text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-school-400"
            >
              <option value="Semester 1">Semester 1 (ወሰነ-ትምህርት 1)</option>
              <option value="Semester 2">Semester 2 (ወሰነ-ትምህርት 2)</option>
            </select>
          </div>

          <div className="sm:col-span-3 flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-school-500 hover:bg-school-400 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4 text-gold-200" />
              )}
              <span>Verify Marks</span>
            </button>
          </div>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-800 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <div>
            <p className="font-semibold">{error}</p>
            <p className="text-xs text-rose-600 mt-0.5">
              Tip: Ensure the ID is typed accurately (e.g. KPS/2026/001, KPS/2026/002, KPS/2026/003).
            </p>
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
          <Loader2 className="w-8 h-8 text-school-700 animate-spin mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-600">Retrieving official academic records...</p>
        </div>
      )}

      {/* Result Display */}
      {resultData && !loading && (
        <div className="space-y-6">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 uppercase">Student Name</span>
              <p className="text-sm font-bold text-slate-900 truncate">
                {resultData.student.fullName}
              </p>
              <span className="text-[11px] text-school-700 font-mono">
                {resultData.student.studentIdNumber}
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 uppercase">Class & Section</span>
              <p className="text-sm font-bold text-slate-900">{resultData.student.className}</p>
              <span className="text-[11px] text-slate-500">{resultData.academicYear}</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 uppercase">Semester Average</span>
              <p className="text-lg font-black text-school-900">
                {resultData.reportCard ? `${resultData.reportCard.average}%` : 'N/A'}
              </p>
              <span className="text-[11px] text-emerald-700 font-medium">
                Total: {resultData.reportCard ? resultData.reportCard.totalMarks : '-'} pts
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 uppercase">Class Rank</span>
              <p className="text-lg font-black text-gold-600">
                {resultData.reportCard
                  ? resultData.reportCard.rank === 1
                    ? '1st Place'
                    : resultData.reportCard.rank === 2
                    ? '2nd Place'
                    : resultData.reportCard.rank === 3
                    ? '3rd Place'
                    : `${resultData.reportCard.rank}th Place`
                  : 'N/A'}
              </p>
              <span className="text-[11px] text-slate-500">
                Status: {resultData.reportCard?.status || 'Active'}
              </span>
            </div>
          </div>

          {/* Full Printable Official Report Card */}
          <PrintableReportCard
            reportCard={resultData.reportCard}
            student={resultData.student}
            academicYear={{ name: resultData.academicYear }}
            semester={resultData.semester}
          />
        </div>
      )}
    </div>
  );
};

export default PublicResultCheckerPage;
