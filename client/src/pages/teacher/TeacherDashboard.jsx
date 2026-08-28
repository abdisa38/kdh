import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  BookOpen,
  FileSpreadsheet,
  Award,
  Users,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Loader2,
} from 'lucide-react';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [assignedClasses, setAssignedClasses] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const [classesRes, newsRes] = await Promise.all([
          api.get('/teachers/me/assigned-classes'),
          api.get('/announcements/public'),
        ]);

        if (classesRes.data?.success) {
          setAssignedClasses(classesRes.data.data);
        }
        if (newsRes.data?.success) {
          setAnnouncements(newsRes.data.data);
        }
      } catch (error) {
        console.error('Error fetching teacher data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, []);

  return (
    <DashboardLayout
      title="Teacher Academic Center"
      subtitle={`Welcome, ${user?.fullName || 'Teacher'} • Subject Grading & Classroom Roster`}
    >
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="bg-school-950 text-white rounded-2xl p-6 sm:p-8 border border-school-900 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-school-900 text-gold-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Active Faculty Member</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight">{user?.fullName}</h1>
              <p className="text-xs text-slate-300 mt-1">
                Academic Year: 2026/2018 E.C. • Semester 1 Mark Submission Active
              </p>
            </div>

            <Link
              to="/teacher/grading"
              className="inline-flex items-center gap-2 px-5 py-3 bg-school-600 hover:bg-school-500 text-white text-xs font-bold rounded-xl shadow transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 text-gold-300" />
              <span>Open Gradebook Marksheet</span>
            </Link>
          </div>
        </div>

        {/* Assigned Classes and Subjects Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-school-700" />
              <span>My Teaching Assignments (የተመደቡባቸው ክፍሎች)</span>
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              {assignedClasses.length} Active Allocations
            </span>
          </div>

          {loading ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
              <Loader2 className="w-8 h-8 text-school-700 animate-spin mx-auto mb-2" />
              <p className="text-sm text-slate-600">Loading assignments...</p>
            </div>
          ) : assignedClasses.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500 text-sm">
              No class assignments found. Please contact the school administrator.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assignedClasses.map((item, index) => {
                const room = item.classRoom;
                const subj = item.subject;

                return (
                  <div
                    key={index}
                    className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-1 rounded-md bg-school-50 text-school-800 text-[11px] font-bold uppercase tracking-wider">
                          Grade {room?.gradeLevel} • Section {room?.section}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-500">
                          {subj?.code}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900">{subj?.name}</h3>
                      <p className="text-xs text-slate-500 mb-4">{subj?.nameAmharic}</p>

                      <div className="text-xs text-slate-600 space-y-1.5 p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex justify-between">
                          <span>Room Location:</span>
                          <span className="font-semibold text-slate-900">
                            {room?.roomNumber || 'Main Building'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Continuous Assmt:</span>
                          <span className="font-semibold text-slate-900">50% Max</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Final Exam:</span>
                          <span className="font-semibold text-slate-900">50% Max</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex gap-2">
                      <Link
                        to={`/teacher/grading?classId=${room?._id}&subjectId=${subj?._id}`}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-school-900 hover:bg-school-800 text-white rounded-lg text-xs font-bold transition-colors"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5 text-gold-400" />
                        <span>Enter Marks</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Notices */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900">Faculty Academic Notices</h2>
          <div className="space-y-3">
            {announcements.slice(0, 2).map((item) => (
              <div key={item._id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-900">{item.title}</span>
                  <span className="text-slate-400">{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-slate-600 line-clamp-2">{item.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
