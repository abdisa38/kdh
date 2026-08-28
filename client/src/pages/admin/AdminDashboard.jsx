import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import api from '../../services/api';
import {
  Users,
  GraduationCap,
  Award,
  BookOpen,
  TrendingUp,
  FileSpreadsheet,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  Building,
  Loader2,
  ChevronRight,
  UserCheck,
} from 'lucide-react';

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await api.get('/dashboard/metrics');
        if (res.data?.success) {
          setMetrics(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching admin metrics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  const summary = metrics?.summary;
  const topStudents = metrics?.topStudents || [];
  const gradeCounts = metrics?.gradeCounts || [];

  return (
    <DashboardLayout
      title="School Director & Administration Center"
      subtitle="Karadibayu Primary School (ካራዲባዩ አንደኛ ደረጃ ት/ቤት) Institutional Analytics"
    >
      <div className="space-y-8">
        {/* Top Header Card */}
        <div className="bg-school-950 text-white rounded-2xl p-6 sm:p-8 border border-school-900 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-school-900 text-gold-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Directorate Administration Portal</span>
              </div>
              <h1 className="text-2xl font-black tracking-tight">
                Academic Management & Institutional Intelligence
              </h1>
              <p className="text-xs text-slate-300 mt-1">
                Current Term: {summary?.academicYear || '2026/2018 E.C.'} • Semester 1 Active
              </p>
            </div>

            <div className="flex gap-2">
              <Link
                to="/admin/mastersheet"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-school-600 hover:bg-school-500 text-white text-xs font-bold rounded-xl shadow transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4 text-gold-300" />
                <span>Master Mark Sheets</span>
              </Link>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <Loader2 className="w-8 h-8 text-school-700 animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-600">Loading institutional analytics...</p>
          </div>
        ) : (
          <>
            {/* KPI Statistics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase mb-2">
                  <span>Total Students</span>
                  <GraduationCap className="w-5 h-5 text-school-700" />
                </div>
                <div className="text-3xl font-black text-slate-900">
                  {summary?.totalStudents || 0}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                  <span>Male: {summary?.maleStudents || 0}</span>
                  <span>•</span>
                  <span>Female: {summary?.femaleStudents || 0}</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase mb-2">
                  <span>Teaching Faculty</span>
                  <Users className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-3xl font-black text-slate-900">
                  {summary?.totalTeachers || 0}
                </div>
                <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
                  All Staff Allocated
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase mb-2">
                  <span>Active Classrooms</span>
                  <Building className="w-5 h-5 text-amber-500" />
                </div>
                <div className="text-3xl font-black text-slate-900">
                  {summary?.totalClasses || 0}
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Grades 1-8 Sections
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase mb-2">
                  <span>Curriculum Subjects</span>
                  <BookOpen className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-3xl font-black text-slate-900">
                  {summary?.totalSubjects || 0}
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  MoE National Standards
                </span>
              </div>
            </div>

            {/* Top Ranked Students & Grade Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Top Performing Students */}
              <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                    <Award className="w-4 h-4 text-gold-600" />
                    <span>Top Performing Honor Roll (ከፍተኛ ውጤት ያስመዘገቡ ተማሪዎች)</span>
                  </div>
                  <Link
                    to="/admin/mastersheet"
                    className="text-xs text-school-700 font-bold hover:underline"
                  >
                    View All
                  </Link>
                </div>

                <div className="divide-y divide-slate-100">
                  {topStudents.map((rc, idx) => (
                    <div
                      key={rc._id}
                      className="py-3 flex items-center justify-between hover:bg-slate-50 px-2 rounded-xl transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${
                            idx === 0
                              ? 'bg-gold-400 text-slate-950 shadow-xs'
                              : idx === 1
                              ? 'bg-slate-300 text-slate-900'
                              : idx === 2
                              ? 'bg-amber-200 text-amber-900'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {idx + 1}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">
                            {rc.student?.firstName} {rc.student?.middleName} {rc.student?.lastName}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500">
                            <span className="font-mono text-school-700">
                              {rc.student?.studentIdNumber}
                            </span>
                            <span>•</span>
                            <span>{rc.classRoom?.name}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-black text-emerald-700">
                          {rc.average}%
                        </span>
                        <div className="text-[10px] text-slate-400 font-medium">
                          Total: {rc.totalMarks} pts
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Class & Grade Breakdown */}
              <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                    <Building className="w-4 h-4 text-school-700" />
                    <span>Classroom Enrollment Counts</span>
                  </div>
                  <Link
                    to="/admin/classes"
                    className="text-xs text-school-700 font-bold hover:underline"
                  >
                    Manage
                  </Link>
                </div>

                <div className="space-y-3">
                  {gradeCounts.map((cls) => (
                    <div key={cls._id} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-800">{cls.name}</span>
                        <span className="text-slate-500">{cls.studentCount} Students</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-school-700 h-full rounded-full"
                          style={{ width: `${Math.min((cls.studentCount / 45) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
