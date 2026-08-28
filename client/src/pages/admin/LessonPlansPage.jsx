import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import api from '../../services/api';
import {
  FolderKanban,
  Plus,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  BookOpen,
  User,
  Check,
} from 'lucide-react';

const LessonPlansPage = () => {
  const [plans, setPlans] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    classRoom: '',
    subject: '',
    weekNumber: 5,
    title: '',
    topic: '',
    learningObjectives: '',
    teachingMethodology: 'Student-centered problem solving and group discussion',
    instructionalMaterials: 'Textbook, chalkboard, geometry sets',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [planRes, classRes, subjRes] = await Promise.all([
        api.get('/modules/lesson-plans'),
        api.get('/academic/classes'),
        api.get('/academic/subjects'),
      ]);

      if (planRes.data?.success) setPlans(planRes.data.data);
      if (classRes.data?.success && classRes.data.data.length > 0) {
        setClasses(classRes.data.data);
        setFormData((prev) => ({ ...prev, classRoom: classRes.data.data[0]._id }));
      }
      if (subjRes.data?.success && subjRes.data.data.length > 0) {
        setSubjects(subjRes.data.data);
        setFormData((prev) => ({ ...prev, subject: subjRes.data.data[0]._id }));
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

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/modules/lesson-plans', formData);
      if (res.data?.success) {
        setMessage('Lesson Plan successfully submitted!');
        setModalOpen(false);
        setFormData((prev) => ({ ...prev, title: '', topic: '', learningObjectives: '' }));
        await loadData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit lesson plan.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/modules/lesson-plans/${id}`, {
        status: 'Approved',
        directorFeedback: 'Approved by Director.',
      });
      setMessage('Lesson plan approved.');
      await loadData();
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  return (
    <DashboardLayout
      title="Lesson Plans & Curriculum Schemes (የትምህርት እቅድ)"
      subtitle="Teacher weekly pedagogical schemes of work and directorate approvals"
    >
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Curriculum Lesson Plans</h2>
              <span className="text-xs text-slate-500">{plans.length} Registered Plans</span>
            </div>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Submit Lesson Plan</span>
          </button>
        </div>

        {message && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{message}</span>
          </div>
        )}

        {loading ? (
          <div className="py-24 text-center bg-white rounded-2xl border border-slate-200">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-500 font-medium">Loading lesson plans...</p>
          </div>
        ) : plans.length === 0 ? (
          <div className="py-20 text-center text-slate-500 text-xs bg-white rounded-2xl border border-slate-200">
            No lesson plans submitted yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans.map((plan) => (
              <div
                key={plan._id}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 text-[11px] font-bold uppercase tracking-wider">
                      Week #{plan.weekNumber} • {plan.classRoom?.name}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        plan.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {plan.status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{plan.title}</h3>
                  <div className="text-xs font-semibold text-blue-700">
                    Subject: {plan.subject?.name} ({plan.subject?.code})
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 space-y-1.5 border border-slate-100">
                    <div>
                      <strong className="text-slate-900 block">Topic / Unit:</strong>
                      <span>{plan.topic}</span>
                    </div>
                    <div>
                      <strong className="text-slate-900 block">Learning Objectives:</strong>
                      <span className="text-slate-600">{plan.learningObjectives}</span>
                    </div>
                    <div>
                      <strong className="text-slate-900 block">Materials:</strong>
                      <span className="text-slate-600">{plan.instructionalMaterials}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Teacher: {plan.teacher?.fullName}</span>
                  {plan.status !== 'Approved' && (
                    <button
                      onClick={() => handleApprove(plan._id)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve Plan</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal: Submit Lesson Plan */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Submit Weekly Lesson Plan</h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreatePlan} className="space-y-4 text-xs">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Week # *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      required
                      value={formData.weekNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, weekNumber: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Classroom *
                    </label>
                    <select
                      value={formData.classRoom}
                      onChange={(e) => setFormData({ ...formData, classRoom: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
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
                      Subject *
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      {subjects.map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.code}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Lesson Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Linear Equations in One Variable"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Topic / Key Concepts *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Algebraic Expressions and Multi-step solving"
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Learning Objectives & Competencies *
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="By the end of the lesson, pupils will be able to..."
                    value={formData.learningObjectives}
                    onChange={(e) =>
                      setFormData({ ...formData, learningObjectives: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  ></textarea>
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
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold"
                  >
                    Submit Plan
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

export default LessonPlansPage;
