import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  GraduationCap,
  Award,
  BookOpen,
  Calendar,
  UserCheck,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  TrendingUp,
  Clock,
  Printer,
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [semester, setSemester] = useState('Semester 1');

  const fetchStudentData = async (selectedSem) => {
    setLoading(true);
    try {
      const res = await api.get(`/students/me/results?semester=${selectedSem}`);
      if (res.data?.success) {
        setData(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching student dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData(semester);
  }, [semester]);

  const student = data?.student;
  const marks = data?.marks || [];
  const reportCard = data?.reportCard;

  return (
    <DashboardLayout
      title="Student Academic Dashboard"
      subtitle={`Welcome back, ${user?.fullName || 'Student'} • Academic Record Overview`}
    >
      <div className="space-y-6">
        {/* Top Profile & Semester Selector Header */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-school-900 text-white flex items-center justify-center font-black text-xl shadow">
              <GraduationCap className="w-8 h-8 text-gold-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">
                {student?.firstName} {student?.middleName} {student?.lastName}
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-0.5">
                <span className="font-mono font-semibold text-school-700">
                  {student?.studentIdNumber}
                </span>
                <span>•</span>
                <span className="font-medium text-slate-700">
                  {student?.currentClass?.name || 'Grade 7 - Section A'}
                </span>
                <span>•</span>
                <span>Roll #{student?.rollNumber || 1}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1 text-xs">
              <button
                onClick={() => setSemester('Semester 1')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                  semester === 'Semester 1'
                    ? 'bg-school-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semester 1 (ወሰነ-ትምህርት 1)
              </button>
              <button
                onClick={() => setSemester('Semester 2')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                  semester === 'Semester 2'
                    ? 'bg-school-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semester 2 (ወሰነ-ትምህርት 2)
              </button>
            </div>

            <Link
              to="/student/report-card"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-school-50 text-school-700 border border-school-200 rounded-xl text-xs font-bold hover:bg-school-100 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Full Report Card</span>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <Loader2 className="w-8 h-8 text-school-700 animate-spin mx-auto mb-2" />
            <p className="text-sm text-slate-600">Loading academic data...</p>
          </div>
        ) : (
          <>
            {/* Key KPI Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase mb-2">
                  <span>Class Rank (ደረጃ)</span>
                  <Award className="w-4 h-4 text-gold-500" />
                </div>
                <div className="text-2xl font-black text-school-900">
                  {reportCard
                    ? reportCard.rank === 1
                      ? '1st Place'
                      : reportCard.rank === 2
                      ? '2nd Place'
                      : reportCard.rank === 3
                      ? '3rd Place'
                      : `${reportCard.rank}th Place`
                    : 'Pending'}
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Out of {reportCard?.totalStudentsInClass || 10} students
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase mb-2">
                  <span>Semester Average</span>
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-2xl font-black text-slate-900">
                  {reportCard ? `${reportCard.average}%` : 'Pending'}
                </div>
                <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
                  Total Marks: {reportCard?.totalMarks || 0} pts
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase mb-2">
                  <span>Conduct (ስነ-ምግባር)</span>
                  <UserCheck className="w-4 h-4 text-blue-500" />
                </div>
                <div className="text-2xl font-black text-emerald-700">
                  Grade {reportCard?.conduct || 'A'}
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Attendance: {reportCard?.attendance?.daysPresent || 90} days
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase mb-2">
                  <span>Promotion Status</span>
                  <CheckCircle2 className="w-4 h-4 text-purple-500" />
                </div>
                <div className="text-sm font-bold text-slate-900 pt-1">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold ${
                      reportCard?.status === 'Promoted'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {reportCard?.status || 'Active Enrollment'}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  {data?.academicYear?.name || '2026/2018 E.C.'}
                </span>
              </div>
            </div>

            {/* Subject Marks Breakdown Grid */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-school-700" />
                  <h2 className="text-base font-bold text-slate-900">
                    Subject Assessment Breakdown (የውጤት ዝርዝር)
                  </h2>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  {marks.length} Subjects Registered
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {marks.map((record) => {
                  const subj = record.subject;
                  const total = record.totalScore || 0;
                  const ca = record.assessments?.totalCA || 0;
                  const finalExam = record.finalExam || 0;

                  return (
                    <div
                      key={record._id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">{subj?.name}</h3>
                          <span className="text-xs text-slate-500">{subj?.nameAmharic}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-black text-school-900">{total}</span>
                          <span className="text-xs text-slate-400">/100</span>
                          <div className="text-[11px] font-bold text-emerald-700">
                            Grade {record.letterGrade}
                          </div>
                        </div>
                      </div>

                      {/* Score Progress Bar */}
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
                        <div
                          className={`h-full rounded-full ${
                            total >= 85
                              ? 'bg-emerald-600'
                              : total >= 70
                              ? 'bg-school-600'
                              : total >= 50
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${Math.min(total, 100)}%` }}
                        ></div>
                      </div>

                      <div className="flex justify-between items-center text-[11px] text-slate-600 pt-1 border-t border-slate-200">
                        <span>
                          Continuous Assmt (50%): <strong>{ca}</strong>
                        </span>
                        <span>
                          Final Exam (50%): <strong>{finalExam}</strong>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
