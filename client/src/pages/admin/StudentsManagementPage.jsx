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
  MoreVertical,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react';

const StudentsManagementPage = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [selectedYear, setSelectedYear] = useState('2018');

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
    dateOfBirth: '2012-05-14',
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
        setSuccessMessage('Student successfully enrolled into SIMS!');
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
          dateOfBirth: '2012-05-14',
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

  // Helper avatar photos
  const avatarColors = [
    'from-blue-600 to-cyan-500',
    'from-purple-600 to-indigo-500',
    'from-emerald-600 to-teal-500',
    'from-amber-500 to-orange-500',
    'from-rose-500 to-pink-500',
  ];

  return (
    <DashboardLayout
      title="Student Directory"
      subtitle="Bole Addis & Karadibayu Primary School Enrolled Pupils (Image 4 SIMS Layout)"
    >
      <div className="space-y-6">
        {/* Top Filter & Search Bar matching Image 4 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row justify-between items-center gap-4">
          <form onSubmit={handleSearchSubmit} className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Academic Year Dropdown (2018) */}
            <div className="w-28">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none"
              >
                <option value="2018">2018 E.C.</option>
                <option value="2017">2017 E.C.</option>
              </select>
            </div>

            {/* Grade Filter */}
            <div className="w-36">
              <select
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
              >
                <option value="">All Grades (1-8)</option>
                <option value="5">Grade 5</option>
                <option value="6">Grade 6</option>
                <option value="7">Grade 7</option>
                <option value="8">Grade 8</option>
              </select>
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>More filters</span>
            </button>
          </form>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              onClick={() => setModalOpen(true)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>Register Student</span>
            </button>
          </div>
        </div>

        {successMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Student Directory Table (Exact columns matching Image 4) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <GraduationCap className="w-4 h-4 text-blue-600" />
              <span>Enrolled Students Roster</span>
            </div>
            <span className="text-slate-500 font-semibold">{students.length} Total Pupils</span>
          </div>

          {loading ? (
            <div className="py-24 text-center">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
              <p className="text-xs text-slate-500">Loading student directory...</p>
            </div>
          ) : students.length === 0 ? (
            <div className="py-20 text-center text-slate-500 text-xs">
              No students found matching your search.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                    <th className="p-3.5 w-28">Admission ID</th>
                    <th className="p-3.5 w-16 text-center">Photo</th>
                    <th className="p-3.5">Full Name</th>
                    <th className="p-3.5 w-20 text-center">Roll</th>
                    <th className="p-3.5 w-20 text-center">Age</th>
                    <th className="p-3.5 w-32">Grade</th>
                    <th className="p-3.5 w-24 text-center">Academic</th>
                    <th className="p-3.5 w-24 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map((student, idx) => {
                    const colorGradient = avatarColors[idx % avatarColors.length];
                    const birthYear = student.dateOfBirth
                      ? new Date(student.dateOfBirth).getFullYear()
                      : 2012;
                    const calculatedAge = 2026 - birthYear;

                    return (
                      <tr key={student._id} className="hover:bg-blue-50/40 transition-colors">
                        <td className="p-3.5 font-mono font-bold text-slate-800">
                          {student.studentIdNumber}
                        </td>
                        <td className="p-3.5 text-center">
                          <div
                            className={`w-9 h-9 rounded-full bg-gradient-to-tr ${colorGradient} text-white flex items-center justify-center font-bold text-xs mx-auto shadow-2xs`}
                          >
                            {student.firstName?.charAt(0)}
                          </div>
                        </td>
                        <td className="p-3.5">
                          <div className="font-extrabold text-slate-900 uppercase">
                            {student.fullName}
                          </div>
                          {student.firstNameAmharic && (
                            <div className="text-[11px] text-slate-500 font-medium">
                              {student.firstNameAmharic} {student.middleNameAmharic}{' '}
                              {student.lastNameAmharic}
                            </div>
                          )}
                        </td>
                        <td className="p-3.5 text-center font-semibold text-slate-700">
                          {student.rollNumber || idx + 1}
                        </td>
                        <td className="p-3.5 text-center font-semibold text-slate-700">
                          {calculatedAge || 13}
                        </td>
                        <td className="p-3.5 font-semibold text-blue-700">
                          {student.currentClass?.name || 'Grade 7 - Section A'}
                        </td>
                        <td className="p-3.5 text-center font-bold text-slate-700">
                          2018
                        </td>
                        <td className="p-3.5 text-center">
                          <Link
                            to={`/check-results?id=${encodeURIComponent(student.studentIdNumber)}`}
                            className="inline-block px-2.5 py-1 bg-slate-100 hover:bg-blue-600 hover:text-white rounded-lg text-[11px] font-bold text-slate-700 transition-colors"
                          >
                            View Card
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal: Register Student */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Register Student (የተማሪ ምዝገባ)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Enrolls student into SIMS and generates ID Number
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
                      Admission / Student ID *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. KPS/2026/011"
                      value={formData.studentIdNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, studentIdNumber: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 uppercase font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Grade & Section *
                    </label>
                    <select
                      value={formData.currentClass}
                      onChange={(e) =>
                        setFormData({ ...formData, currentClass: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
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
                      placeholder="e.g. Lidet"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Father's Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kinifemikaeil"
                      value={formData.middleName}
                      onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Grandfather's *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Belaynih"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                {/* Parent Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Gender *
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
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
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
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
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
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
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {submitting && <Loader2 className="w-4 h-4 animate-spin text-white" />}
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
