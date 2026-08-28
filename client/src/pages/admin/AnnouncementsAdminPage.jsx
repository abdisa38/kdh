import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import api from '../../services/api';
import {
  Bell,
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Tag,
} from 'lucide-react';

const AnnouncementsAdminPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    titleAmharic: '',
    content: '',
    contentAmharic: '',
    category: 'General',
    targetAudience: 'All',
    priority: 'Normal',
    isPublic: true,
  });

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await api.get('/announcements');
      if (res.data?.success) setAnnouncements(res.data.data);
    } catch (err) {
      console.error('Error fetching announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/announcements', formData);
      if (res.data?.success) {
        setMessage('Announcement published successfully!');
        setModalOpen(false);
        setFormData({
          title: '',
          titleAmharic: '',
          content: '',
          contentAmharic: '',
          category: 'General',
          targetAudience: 'All',
          priority: 'Normal',
          isPublic: true,
        });
        await fetchNews();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to publish announcement.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    try {
      await api.delete(`/announcements/${id}`);
      setMessage('Announcement deleted.');
      await fetchNews();
    } catch (err) {
      alert('Failed to delete.');
    }
  };

  return (
    <DashboardLayout
      title="Official Announcements & Notice Board"
      subtitle="Publish and manage school schedules, examinations, and community updates"
    >
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-school-50 text-school-800 flex items-center justify-center font-bold">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Notice Management Board</h2>
              <span className="text-xs text-slate-500">{announcements.length} Published Notices</span>
            </div>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="w-full sm:w-auto px-4 py-2.5 bg-school-900 hover:bg-school-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow cursor-pointer"
          >
            <Plus className="w-4 h-4 text-gold-400" />
            <span>Publish New Notice</span>
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
            <p className="text-xs text-slate-600">Loading notices...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {announcements.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md bg-school-50 text-school-800 text-[11px] font-bold uppercase tracking-wider">
                      {item.category}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                  {item.titleAmharic && (
                    <h4 className="text-xs font-semibold text-school-800">{item.titleAmharic}</h4>
                  )}
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {item.content}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-medium">
                    Audience: {item.targetAudience}
                  </span>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete Announcement"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal: Create Announcement */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Publish School Notice</h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Notice Title (English) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. End of Semester Examination Schedule"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-school-600 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Notice Title (Amharic)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. የወሰነ-ትምህርት ማጠቃለያ ፈተና ፕሮግራም"
                    value={formData.titleAmharic}
                    onChange={(e) => setFormData({ ...formData, titleAmharic: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-school-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-school-600"
                    >
                      <option value="General">General</option>
                      <option value="Academic">Academic</option>
                      <option value="Exam">Exam</option>
                      <option value="Holiday">Holiday</option>
                      <option value="Registration">Registration</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Target Audience
                    </label>
                    <select
                      value={formData.targetAudience}
                      onChange={(e) =>
                        setFormData({ ...formData, targetAudience: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-school-600"
                    >
                      <option value="All">All Audiences</option>
                      <option value="Students">Students Only</option>
                      <option value="Parents">Parents Only</option>
                      <option value="Teachers">Teachers Only</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Announcement Body (English) *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Enter detailed notice content..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-school-600"
                  ></textarea>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Announcement Body (Amharic)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.contentAmharic}
                    onChange={(e) =>
                      setFormData({ ...formData, contentAmharic: e.target.value })
                    }
                    placeholder="የማስታወቂያ ዝርዝር በአማርኛ..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-school-600"
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
                    className="px-5 py-2 bg-school-900 text-white rounded-xl font-bold"
                  >
                    Publish Notice
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

export default AnnouncementsAdminPage;
