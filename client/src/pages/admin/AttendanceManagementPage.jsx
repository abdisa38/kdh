import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import api from '../../services/api';
import {
  UserCheck,
  Calendar,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Clock,
  Check,
  X,
  AlertTriangle,
} from 'lucide-react';

const AttendanceManagementPage = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [roster, setRoster] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
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

  const loadAttendance = async () => {
    if (!selectedClass) return;
    setLoading(true);
    setMessage('');
    try {
      const res = await api.get(
        `/modules/attendance?classRoomId=${selectedClass}&date=${selectedDate}`
      );
      if (res.data?.success) {
        setRoster(res.data.data.roster || []);
      }
    } catch (err) {
      console.error('Error fetching attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedClass) {
      loadAttendance();
    }
  }, [selectedClass, selectedDate]);

  const handleStatusChange = (index, newStatus) => {
    setRoster((prev) => {
      const copy = [...prev];
      copy[index].status = newStatus;
      return copy;
    });
  };

  const handleRemarkChange = (index, val) => {
    setRoster((prev) => {
      const copy = [...prev];
      copy[index].remark = val;
      return copy;
    });
  };

  const handleSaveAttendance = async () => {
    if (!selectedClass) return;
    setSaving(true);
    setMessage('');
    try {
      const records = roster.map((item) => ({
        studentId: item.studentId,
        status: item.status,
        remark: item.remark,
      }));

      const res = await api.post('/modules/attendance', {
        classRoomId: selectedClass,
        date: selectedDate,
        records,
      });

      if (res.data?.success) {
        setMessage('Attendance roster successfully submitted and recorded!');
      }
    } catch (err) {
      console.error('Error saving attendance:', err);
      setMessage('Failed to save attendance.');
    } finally {
      setSaving(false);
    }
  };

  const markAllPresent = () => {
    setRoster((prev) => prev.map((s) => ({ ...s, status: 'Present' })));
  };

  return (
    <DashboardLayout
      title="Student Daily Attendance Roster (የተማሪዎች የቀን ክትትል)"
      subtitle="Period & Daily presence logging for primary classrooms"
    >
      <div className="space-y-6">
        {/* Controls Bar */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="w-full sm:w-60">
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

            <div className="w-full sm:w-44">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Attendance Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={markAllPresent}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Mark All Present
            </button>
            <button
              onClick={handleSaveAttendance}
              disabled={saving || roster.length === 0}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Save className="w-4 h-4 text-white" />}
              <span>Save Attendance</span>
            </button>
          </div>
        </div>

        {message && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{message}</span>
          </div>
        )}

        {/* Attendance Roster Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>Attendance Sheet • {new Date(selectedDate).toDateString()}</span>
            </div>
            <span className="text-slate-500 font-semibold">{roster.length} Students in Class</span>
          </div>

          {loading ? (
            <div className="py-24 text-center">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
              <p className="text-xs text-slate-500 font-medium">Loading attendance roster...</p>
            </div>
          ) : roster.length === 0 ? (
            <div className="py-20 text-center text-slate-500 text-xs">
              No students enrolled in this section.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                    <th className="p-3.5 w-12 text-center">#</th>
                    <th className="p-3.5 w-28">Admission ID</th>
                    <th className="p-3.5">Student Full Name</th>
                    <th className="p-3.5 w-20 text-center">Sex</th>
                    <th className="p-3.5 w-72 text-center">Attendance Status</th>
                    <th className="p-3.5">Remarks / Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {roster.map((row, idx) => (
                    <tr key={row.studentId} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3.5 text-center font-semibold text-slate-500">{idx + 1}</td>
                      <td className="p-3.5 font-mono font-bold text-slate-800">
                        {row.studentIdNumber}
                      </td>
                      <td className="p-3.5 font-bold text-slate-900">{row.fullName}</td>
                      <td className="p-3.5 text-center text-slate-600">
                        {row.gender === 'Male' ? 'M' : 'F'}
                      </td>

                      {/* Status Toggle Buttons */}
                      <td className="p-2 text-center">
                        <div className="inline-flex rounded-xl bg-slate-100 p-1 gap-1">
                          <button
                            type="button"
                            onClick={() => handleStatusChange(idx, 'Present')}
                            className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                              row.status === 'Present'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            Present
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(idx, 'Late')}
                            className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                              row.status === 'Late'
                                ? 'bg-amber-500 text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            Late
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(idx, 'Absent')}
                            className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                              row.status === 'Absent'
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            Absent
                          </button>
                        </div>
                      </td>

                      {/* Remark */}
                      <td className="p-2">
                        <input
                          type="text"
                          placeholder="e.g. excused sick leave"
                          value={row.remark || ''}
                          onChange={(e) => handleRemarkChange(idx, e.target.value)}
                          className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none"
                        />
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

export default AttendanceManagementPage;
