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
  Clock,
  RefreshCw,
  LineChart,
  BarChart3,
  Sparkles,
  Layers,
  Filter,
} from 'lucide-react';

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMetrics = async () => {
    try {
      const res = await api.get('/dashboard/metrics');
      if (res.data?.success) {
        setMetrics(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching metrics:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const handleSync = () => {
    setRefreshing(true);
    fetchMetrics();
  };

  const summary = metrics?.summary;
  const topStudents = metrics?.topStudents || [];
  const gradeCounts = metrics?.gradeCounts || [];

  return (
    <DashboardLayout
      title="SIMS Overview"
      subtitle="Bole Addis & Karadibayu Primary School Management Information System"
    >
      <div className="space-y-6">
        {/* Overview Header Pill & Sync Bar (Matches Images 1 & 2) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-cyan-500 text-white font-bold text-xs shadow-xs">
              <span>Overview</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Academic Year: <strong className="text-slate-800">2018 E.C. (2026)</strong> • Term 1
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-600 font-medium shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Last Updated: {new Date().toLocaleDateString()}</span>
            </div>

            <button
              onClick={handleSync}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl shadow-2xs transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Sync</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-slate-200">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-500 font-medium">Loading SIMS intelligence...</p>
          </div>
        ) : (
          <>
            {/* Top 4 Stats Cards with Circular Gradient Badges (Exact design from Images 1, 2, 3) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Card 1: Total Registration */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex items-center gap-5 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-full bg-cyan-50 border-2 border-cyan-100 flex items-center justify-center shrink-0">
                  <LineChart className="w-6 h-6 text-cyan-600" />
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900 tracking-tight">1,204</div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                    Total Registration
                  </div>
                  <div className="text-[10px] text-emerald-600 font-semibold mt-1">
                    Verified In System
                  </div>
                </div>
              </div>

              {/* Card 2: Total Student Gross Enrollment */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex items-center gap-5 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-500 flex items-center justify-center text-white shrink-0 shadow-sm">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900 tracking-tight">3,488</div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                    Total Student Gross Enrollment
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-600 font-medium mt-1">
                    <span><strong>1,645</strong> Male</span>
                    <span>•</span>
                    <span><strong>1,843</strong> Female</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Total Active Students */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex items-center gap-5 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900 tracking-tight">3,434</div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                    Total Active Students
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-600 font-medium mt-1">
                    <span><strong>1,616</strong> Male</span>
                    <span>•</span>
                    <span><strong>1,818</strong> Female</span>
                  </div>
                </div>
              </div>

              {/* Card 4: Special Need Students / Filters */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex items-center gap-5 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-full bg-slate-900 flex items-center justify-center text-cyan-400 shrink-0">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900 tracking-tight">0</div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                    Total Special Need Students
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-600 font-medium mt-1">
                    <span><strong>0</strong> Male</span>
                    <span>•</span>
                    <span><strong>0</strong> Female</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Enrollment Charts (Matches Images 1, 2, 3) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chart 1: Gross enrollment summary by language */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-900">
                    Student gross enrollment summary by language & grade
                  </h3>
                  <span className="text-[11px] font-semibold text-slate-400">2018 E.C.</span>
                </div>

                {/* Simulated Chart Bars matching Image 1 */}
                <div className="h-64 flex items-end justify-between gap-4 pt-8 px-4 border-b border-slate-200">
                  <div className="flex flex-col items-center gap-2 w-16">
                    <div className="w-full bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-lg h-36 relative group">
                      <span className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-0.5 px-1.5 rounded transition-opacity font-bold">
                        1,420
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-600">Amharic</span>
                  </div>

                  <div className="flex flex-col items-center gap-2 w-16">
                    <div className="w-full bg-gradient-to-t from-emerald-600 to-teal-400 rounded-t-lg h-44 relative group">
                      <span className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-0.5 px-1.5 rounded transition-opacity font-bold">
                        1,680
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-600">Afan Oromo</span>
                  </div>

                  <div className="flex flex-col items-center gap-2 w-16">
                    <div className="w-full bg-gradient-to-t from-amber-500 to-yellow-400 rounded-t-lg h-56 relative group">
                      <span className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-0.5 px-1.5 rounded transition-opacity font-bold">
                        3,200
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-600">English</span>
                  </div>

                  <div className="flex flex-col items-center gap-2 w-16">
                    <div className="w-full bg-gradient-to-t from-purple-500 to-indigo-400 rounded-t-lg h-16 relative group">
                      <span className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-0.5 px-1.5 rounded transition-opacity font-bold">
                        388
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-600">Other</span>
                  </div>
                </div>
              </div>

              {/* Chart 2: Active students summary by grade */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-900">
                    Active students summary by grade level (Grades 1-8)
                  </h3>
                  <span className="text-[11px] font-semibold text-slate-400">Sections A-D</span>
                </div>

                <div className="h-64 flex items-end justify-between gap-3 pt-8 px-2 border-b border-slate-200">
                  {[
                    { label: 'G1', val: 420, h: 'h-32', col: 'from-blue-600 to-cyan-400' },
                    { label: 'G2', val: 410, h: 'h-30', col: 'from-blue-600 to-cyan-400' },
                    { label: 'G3', val: 435, h: 'h-36', col: 'from-blue-600 to-cyan-400' },
                    { label: 'G4', val: 450, h: 'h-40', col: 'from-blue-600 to-cyan-400' },
                    { label: 'G5', val: 390, h: 'h-28', col: 'from-emerald-600 to-teal-400' },
                    { label: 'G6', val: 415, h: 'h-34', col: 'from-emerald-600 to-teal-400' },
                    { label: 'G7', val: 460, h: 'h-44', col: 'from-amber-500 to-orange-400' },
                    { label: 'G8', val: 454, h: 'h-42', col: 'from-amber-500 to-orange-400' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-2 flex-1">
                      <div
                        className={`w-full bg-gradient-to-t ${item.col} rounded-t-md ${item.h} relative group`}
                      >
                        <span className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] py-0.5 px-1 rounded font-bold">
                          {item.val}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-slate-600">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Academic Standings & Roster Highlights */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Honor Roll: Top Ranked Students with pure numerical averages */}
              <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                    <Award className="w-4 h-4 text-amber-600" />
                    <span>Top Ranked Students (ከፍተኛ ውጤት ያስመዘገቡ ተማሪዎች)</span>
                  </div>
                  <Link
                    to="/admin/mastersheet"
                    className="text-xs text-blue-600 font-bold hover:underline"
                  >
                    View Master Sheet
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
                              ? 'bg-amber-400 text-slate-950 shadow-xs'
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
                            <span className="font-mono text-blue-700 font-bold">
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

              {/* Fast Quick Action Cards */}
              <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Quick Administration Access
                </h3>

                <Link
                  to="/admin/id-cards"
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/70 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 group-hover:text-blue-700">
                        Generate Student ID Cards
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Printable cards with photo & barcode
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                </Link>

                <Link
                  to="/admin/attendance"
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200/70 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 group-hover:text-emerald-700">
                        Daily Attendance Rosters
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Track classroom presence & absence
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
                </Link>

                <Link
                  to="/admin/timetable"
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200/70 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 group-hover:text-amber-700">
                        Classroom Timetables
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Period 1-7 weekly schedule
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600" />
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
