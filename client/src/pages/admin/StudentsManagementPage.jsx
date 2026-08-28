import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import api from '../../services/api';
import {
  GraduationCap,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  User,
  Phone,
} from 'lucide-react';

const StudentsManagementPage = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    studentIdNumber: '',
    firstName: '',
    middleName: '',
    lastName: '',
    firstNameAmharic: '',
    middleNameAmharic: '',
    lastNameAmharic: '',
    gender: 'Male',
    currentClass: '',
    parentName: '',
    parentPhone: '',
    password: 'kps123456',
  });

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const [studRes, classRes] = await Promise.all([
        api.get(`/students?search=${searchQuery}${gradeFilter ? `&gradeLevel=${gradeFilter}` : ''}`),
        api.get('/academic/classes'),
      ]);

      if (studRes.data?.success) {
        setStudents(studRes.data.data);
      }
      if (classRes.data?.success) {
        setClasses(classRes.data.data);
        if (!formData.currentClass && classRes.data.data.length > 0) {
          setFormData((prev) => ({ ...prev, currentClass: classRes.data.data[0]._id }));
        }
      }
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [gradeFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchStudents();
  };

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await api.post('/students', formData);
      if (res.data?.success) {
        setSuccessMessage('Student successfully enrolled and account initialized!');
        setModalOpen(false);
        setFormData({
          studentIdNumber: '',
          firstName: '',
          middleName: '',
          lastName: '',
          firstNameAmharic: '',
          middleNameAmharic: '',
          lastNameAmharic: '',
          gender: 'Male',
          currentClass: classes[0]?._id || '',
          parentName: '',
          parentPhone: '',
          password: 'kps123456',
        });
        await fetchStudents();
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to register student.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout
      title="Student Records & Enrollment Management"
      subtitle="Primary School Pupil Database with Ethiopian 3-Part Naming Structure (የተማሪዎች መዝገብ)"
    >
      <div className="space-y-6">
        {/* Action Header */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
          <form onSubmit={handleSearchSubmit} className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-school-600"
              />
            </div>

            <div className="w-full sm:w-44">
              <select
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-school-600"
              >
                <option value="">All Grade Levels</option>
                <option value="5">Grade 5</option>
                <option value="6">Grade 6</option>
                <option value="7">Grade 7</option>
                <option value="8">Grade 8</option>
              </select>
            </div>
          </form>

          <button
            onClick={() => setModalOpen(true)}
            className="w-full sm:w-auto px-4 py-2.5 bg-school-900 hover:bg-school-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow cursor-pointer"
          >
            <Plus className="w-4 h-4 text-gold-400" />
            <span>Register New Student</span>
          </button>
        </div>

        {successMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Student Records Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-900 text-white flex justify-between items-center text-xs">
            <div className="flex items-center gap-2 font-bold">
              <GraduationCap className="w-4 h-4 text-gold-400" />
              <span>Official Student Roster</span>
            </div>
            <span className="text-slate-400">{students.length} Records</span>
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <Loader2 className="w-8 h-8 text-school-700 animate-spin mx-auto mb-2" />
              <p className="text-xs text-slate-600">Retrieving student records...</p>
            </div>
          ) : students.length === 0 ? (
            <div className="py-20 text-center text-slate-500 text-xs">
              No students found matching the query.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                    <th className="p-3 w-12 text-center">#</th>
                    <th className="p-3 w-32">Student ID</th>
                    <th className="p-3">Full Student Name (English / Amharic)</th>
                    <th className="p-3 w-20 text-center">Gender</th>
                    <th className="p-3 w-36">Class & Section</th>
                    <th className="p-3 w-36">Parent Name</th>
                    <th className="p-3 w-32">Parent Phone</th>
                    <th className="p-3 w-20 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {students.map((student, idx) => (
                    <tr key={student._id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 text-center text-slate-500 font-semibold">{idx + 1}</td>
                      <td className="p-3 font-mono font-bold text-school-800">
                        {student.studentIdNumber}
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{student.fullName}</div>
                        {student.firstNameAmharic && (
                          <div className="text-[11px] text-slate-500">
                            {student.firstNameAmharic} {student.middleNameAmharic}{' '}
                            {student.lastNameAmharic}
                          </div>
                        )}
                      </td>
                      <td className="p-3 text-center text-slate-600">{student.gender}</td>
                      <td className="p-3 font-medium text-slate-800">
                        {student.currentClass?.name || 'Unassigned'}
                      </td>
                      <td className="p-3 text-slate-700">{student.parentName}</td>
                      <td className="p-3 font-mono text-slate-600">{student.parentPhone}</td>
                      <td className="p-3 text-center">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {student.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal: Register Student */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Register New Primary School Student
                  </h3>
                  <p className="text-xs text-slate-500">
                    Creates student record and portal access account
                  </p>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleCreateStudent} className="space-y-4 text-xs">
                {/* ID & Class */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Student ID Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. KPS/2026/011"
                      value={formData.studentIdNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, studentIdNumber: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-school-600 uppercase font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Assigned Classroom *
                    </label>
                    <select
                      value={formData.currentClass}
                      onChange={(e) =>
                        setFormData({ ...formData, currentClass: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-school-600"
                    >
                      {classes.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* English Names */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dawit"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-school-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Father's Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bekele"
                      value={formData.middleName}
                      onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-school-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Grandfather's *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Haile"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-school-600"
                    />
                  </div>
                </div>

                {/* Amharic Names */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      ስም (Amharic)
                    </label>
                    <input
                      type="text"
                      placeholder="ዳዊት"
                      value={formData.firstNameAmharic}
                      onChange={(e) =>
                        setFormData({ ...formData, firstNameAmharic: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-school-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      የአባት ስም
                    </label>
                    <input
                      type="text"
                      placeholder="በቀለ"
                      value={formData.middleNameAmharic}
                      onChange={(e) =>
                        setFormData({ ...formData, middleNameAmharic: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-school-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      የአያት ስም
                    </label>
                    <input
                      type="text"
                      placeholder="ኃይሌ"
                      value={formData.lastNameAmharic}
                      onChange={(e) =>
                        setFormData({ ...formData, lastNameAmharic: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-school-600"
                    />
                  </div>
                </div>

                {/* Gender, Parent Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Gender *
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-school-600"
                    >
                      <option value="Male">Male (ወንድ)</option>
                      <option value="Female">Female (ሴት)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Parent / Guardian Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Parent full name"
                      value={formData.parentName}
                      onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-school-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Parent Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+251 9..."
                      value={formData.parentPhone}
                      onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-school-600"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 bg-school-900 hover:bg-school-800 text-white rounded-xl font-bold transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {submitting && <Loader2 className="w-4 h-4 animate-spin text-gold-400" />}
                    <span>Complete Enrollment</span>
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

export default StudentsManagementPage;
