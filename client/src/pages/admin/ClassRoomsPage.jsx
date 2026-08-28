import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import api from '../../services/api';
import {
  BookOpen,
  Plus,
  Users,
  Building,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  UserCheck,
} from 'lucide-react';

const ClassRoomsPage = () => {
  const [classes, setClasses] = useState([]);
  const [years, setYears] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    gradeLevel: 7,
    section: 'C',
    academicYear: '',
    homeRoomTeacher: '',
    roomNumber: 'Block B - Room 104',
    capacity: 45,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [classRes, yearRes, teachRes] = await Promise.all([
        api.get('/academic/classes'),
        api.get('/academic/years'),
        api.get('/teachers'),
      ]);

      if (classRes.data?.success) setClasses(classRes.data.data);
      if (yearRes.data?.success) {
        setYears(yearRes.data.data);
        if (yearRes.data.data.length > 0) {
          setFormData((prev) => ({ ...prev, academicYear: yearRes.data.data[0]._id }));
        }
      }
      if (teachRes.data?.success) {
        setTeachers(teachRes.data.data);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateClass = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/academic/classes', formData);
      if (res.data?.success) {
        setMessage('Classroom Section successfully created!');
        setModalOpen(false);
        await loadData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create section.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout
      title="Classrooms & Section Allocations"
      subtitle="Primary School Grade Structure (Grades 1 to 8) & Homeroom Assignments"
    >
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-school-50 text-school-800 flex items-center justify-center font-bold">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Academic Sections Directory</h2>
              <span className="text-xs text-slate-500">{classes.length} Active Classroom Sections</span>
            </div>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="w-full sm:w-auto px-4 py-2.5 bg-school-900 hover:bg-school-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow cursor-pointer"
          >
            <Plus className="w-4 h-4 text-gold-400" />
            <span>Create Classroom Section</span>
          </button>
        </div>

        {message && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{message}</span>
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center bg-white rounded-2xl border border-slate-200">
            <Loader2 className="w-8 h-8 text-school-700 animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-600">Loading classrooms...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((cls) => (
              <div
                key={cls._id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-lg bg-school-900 text-white text-xs font-bold uppercase tracking-wider">
                    Grade {cls.gradeLevel}
                  </span>
                  <span className="text-xs font-bold text-slate-600 px-2 py-0.5 bg-slate-100 rounded">
                    Section {cls.section}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">{cls.name}</h3>
                  <p className="text-xs text-slate-500">{cls.roomNumber || 'Main Academic Block'}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Homeroom Teacher:</span>
                    <span className="font-bold text-slate-900">
                      {cls.homeRoomTeacher?.fullName || 'Not Assigned'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Max Capacity:</span>
                    <span className="font-semibold text-slate-800">{cls.capacity} Pupils</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Academic Year:</span>
                    <span className="font-semibold text-school-700">
                      {cls.academicYear?.name || '2026/2018 E.C.'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal: Create Class */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Create New Class Section</h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateClass} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Grade Level (1-8) *
                    </label>
                    <select
                      value={formData.gradeLevel}
                      onChange={(e) =>
                        setFormData({ ...formData, gradeLevel: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-school-600"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((g) => (
                        <option key={g} value={g}>
                          Grade {g}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Section Code *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. A, B, C"
                      value={formData.section}
                      onChange={(e) =>
                        setFormData({ ...formData, section: e.target.value.toUpperCase() })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-school-600 uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Homeroom Teacher
                  </label>
                  <select
                    value={formData.homeRoomTeacher}
                    onChange={(e) =>
                      setFormData({ ...formData, homeRoomTeacher: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-school-600"
                  >
                    <option value="">-- Select Teacher --</option>
                    {teachers.map((t) => (
                      <option key={t.user?._id || t._id} value={t.user?._id || t._id}>
                        {t.firstName} {t.lastName} ({t.employeeIdNumber})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Room Number / Location
                  </label>
                  <input
                    type="text"
                    value={formData.roomNumber}
                    onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-school-600"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 bg-school-900 text-white rounded-xl font-bold"
                  >
                    Create Section
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ClassRoomsPage;
