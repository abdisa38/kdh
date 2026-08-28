import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import api from '../../services/api';
import {
  Users,
  Plus,
  Search,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Phone,
  Mail,
  Award,
} from 'lucide-react';

const TeachersManagementPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  // Register Form
  const [formData, setFormData] = useState({
    employeeIdNumber: '',
    firstName: '',
    lastName: '',
    gender: 'Male',
    phone: '',
    email: '',
    qualification: 'B.Ed in Primary Education',
    specialization: 'General Education',
    password: 'teacher123',
  });

  // Assign Form
  const [assignClassId, setAssignClassId] = useState('');
  const [assignSubjectId, setAssignSubjectId] = useState('');

  const fetchFaculty = async () => {
    setLoading(true);
    try {
      const [teachRes, classRes, subjRes] = await Promise.all([
        api.get('/teachers'),
        api.get('/academic/classes'),
        api.get('/academic/subjects'),
      ]);

      if (teachRes.data?.success) setTeachers(teachRes.data.data);
      if (classRes.data?.success) {
        setClasses(classRes.data.data);
        if (classRes.data.data.length > 0) setAssignClassId(classRes.data.data[0]._id);
      }
      if (subjRes.data?.success) {
        setSubjects(subjRes.data.data);
        if (subjRes.data.data.length > 0) setAssignSubjectId(subjRes.data.data[0]._id);
      }
    } catch (err) {
      console.error('Error fetching faculty:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  const handleCreateTeacher = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/teachers', formData);
      if (res.data?.success) {
        setMessage('Teacher registered successfully!');
        setRegisterModalOpen(false);
        setFormData({
          employeeIdNumber: '',
          firstName: '',
          lastName: '',
          gender: 'Male',
          phone: '',
          email: '',
          qualification: 'B.Ed in Primary Education',
          specialization: 'General Education',
          password: 'teacher123',
        });
        await fetchFaculty();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to register teacher.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssignClassSubject = async (e) => {
    e.preventDefault();
    if (!selectedTeacher || !assignClassId || !assignSubjectId) return;

    setSubmitting(true);
    try {
      const existing = selectedTeacher.assignedClasses || [];
      const updatedList = [
        ...existing.map((item) => ({
          classRoom: item.classRoom?._id || item.classRoom,
          subject: item.subject?._id || item.subject,
        })),
        { classRoom: assignClassId, subject: assignSubjectId },
      ];

      const res = await api.put(`/teachers/${selectedTeacher._id}/assign`, {
        assignedClasses: updatedList,
      });

      if (res.data?.success) {
        setMessage('Class & Subject assigned successfully!');
        setAssignModalOpen(false);
        await fetchFaculty();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update assignment.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout
      title="Teaching Staff & Faculty Management"
      subtitle="Teacher Roster, Qualifications, and Classroom Subject Assignments (የመምህራን መዝገብ)"
    >
      <div className="space-y-6">
        {/* Top Header */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-school-50 text-school-800 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Faculty Directorate</h2>
              <span className="text-xs text-slate-500">{teachers.length} Active Educators</span>
            </div>
          </div>

          <button
            onClick={() => setRegisterModalOpen(true)}
            className="w-full sm:w-auto px-4 py-2.5 bg-school-900 hover:bg-school-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow cursor-pointer"
          >
            <Plus className="w-4 h-4 text-gold-400" />
            <span>Register Faculty Member</span>
          </button>
        </div>

        {message && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{message}</span>
          </div>
        )}

        {/* Teachers Grid */}
        {loading ? (
          <div className="py-20 text-center bg-white rounded-2xl border border-slate-200">
            <Loader2 className="w-8 h-8 text-school-700 animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-600">Loading teaching faculty...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachers.map((teacher) => (
              <div
                key={teacher._id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md bg-school-50 text-school-800 text-[11px] font-bold uppercase tracking-wider font-mono">
                      {teacher.employeeIdNumber}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {teacher.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {teacher.firstName} {teacher.lastName}
                    </h3>
                    <p className="text-xs text-slate-500">{teacher.qualification}</p>
                    <p className="text-xs text-school-700 font-medium">{teacher.specialization}</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{teacher.phone}</span>
                    </div>
                    {teacher.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{teacher.email}</span>
                      </div>
                    )}
                  </div>

                  {/* Assigned Classes */}
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                      Assigned Subjects ({teacher.assignedClasses?.length || 0}):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {teacher.assignedClasses && teacher.assignedClasses.length > 0 ? (
                        teacher.assignedClasses.map((item, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-[11px] text-slate-800 font-semibold"
                          >
                            {item.classRoom?.name} • {item.subject?.code}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 italic">No classes assigned yet</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setSelectedTeacher(teacher);
                      setAssignModalOpen(true);
                    }}
                    className="w-full py-2 bg-slate-100 hover:bg-school-900 hover:text-white text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Assign Subject / Class</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal: Register Teacher */}
        {registerModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Register Teacher / Faculty</h3>
                <button
                  onClick={() => setRegisterModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateTeacher} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Abdisa"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-school-600"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Awel"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-school-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+251 9..."
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-school-600"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Gender
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-school-600"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Academic Qualification
                  </label>
                  <input
                    type="text"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-school-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Specialization Field
                  </label>
                  <input
                    type="text"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-school-600"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setRegisterModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 bg-school-900 text-white rounded-xl font-bold flex items-center gap-1.5"
                  >
                    {submitting && <Loader2 className="w-4 h-4 animate-spin text-gold-400" />}
                    <span>Register Teacher</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Assign Class & Subject */}
        {assignModalOpen && selectedTeacher && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Assign Class & Subject
                  </h3>
                  <p className="text-xs text-school-700 font-semibold">
                    Teacher: {selectedTeacher.firstName} {selectedTeacher.lastName}
                  </p>
                </div>
                <button
                  onClick={() => setAssignModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAssignClassSubject} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Select Classroom
                  </label>
                  <select
                    value={assignClassId}
                    onChange={(e) => setAssignClassId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-school-600"
                  >
                    {classes.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Select Subject
                  </label>
                  <select
                    value={assignSubjectId}
                    onChange={(e) => setAssignSubjectId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-school-600"
                  >
                    {subjects.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name} ({s.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setAssignModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 bg-school-900 text-white rounded-xl font-bold"
                  >
                    Confirm Assignment
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

export default TeachersManagementPage;
