import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import api from '../../services/api';
import { UserCheck, CheckCircle2, XCircle, Calendar, ShieldCheck, Loader2 } from 'lucide-react';

const StudentAttendancePage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await api.get('/students/me/results?semester=Semester 1');
        if (res.data?.success) {
          setData(res.data.data);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const reportCard = data?.reportCard;
  const attendance = reportCard?.attendance || { daysPresent: 90, daysAbsent: 2, totalDays: 92 };

  return (
    <DashboardLayout
      title="Attendance & Conduct Records"
      subtitle="Disciplinary standing and school attendance tracking (ስነ-ምግባርና የተማሪዎች ክትትል)"
    >
      {loading ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
          <Loader2 className="w-8 h-8 text-school-700 animate-spin mx-auto mb-2" />
          <p className="text-sm text-slate-600">Loading attendance data...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase mb-2">
                <span>Conduct Grade (ስነ-ምግባር)</span>
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-3xl font-black text-emerald-700">
                Grade {reportCard?.conduct || 'A'}
              </div>
              <span className="text-xs text-slate-500 mt-1 block">
                Evaluated by Homeroom Teacher
              </span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase mb-2">
                <span>Days Present</span>
                <CheckCircle2 className="w-5 h-5 text-school-600" />
              </div>
              <div className="text-3xl font-black text-slate-900">
                {attendance.daysPresent}{' '}
                <span className="text-sm text-slate-500 font-normal">/ {attendance.totalDays}</span>
              </div>
              <span className="text-xs text-emerald-700 font-semibold mt-1 block">
                {Math.round((attendance.daysPresent / (attendance.totalDays || 1)) * 100)}%
                Attendance Rate
              </span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase mb-2">
                <span>Excused Absences</span>
                <XCircle className="w-5 h-5 text-amber-500" />
              </div>
              <div className="text-3xl font-black text-amber-600">
                {attendance.daysAbsent}{' '}
                <span className="text-sm text-slate-500 font-normal">days</span>
              </div>
              <span className="text-xs text-slate-500 mt-1 block">
                Within permitted institutional thresholds
              </span>
            </div>
          </div>

          {/* Conduct Criteria & Notes */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900">
              Ethiopian Ministry of Education Disciplinary Evaluation Matrix
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                <span className="font-bold block text-sm mb-1">Grade A (በጣም ጥሩ)</span>
                <span>Exemplary discipline, punctuality, respectful conduct, and zero unexcused absences.</span>
              </div>
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900">
                <span className="font-bold block text-sm mb-1">Grade B (ጥሩ)</span>
                <span>Good behavior, minor tardiness with valid justification.</span>
              </div>
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                <span className="font-bold block text-sm mb-1">Grade C (መካከለኛ)</span>
                <span>Needs improvement in classroom focus or assignment submission.</span>
              </div>
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900">
                <span className="font-bold block text-sm mb-1">Grade D (ዝቅተኛ)</span>
                <span>Disciplinary warning issued; parent consultation mandated.</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default StudentAttendancePage;
