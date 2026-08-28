import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  Bell,
  Calendar,
  Search,
  Filter,
  Tag,
  AlertCircle,
  Loader2,
} from 'lucide-react';

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await api.get('/announcements/public');
        if (res.data?.success) {
          setAnnouncements(res.data.data);
        }
      } catch (error) {
        console.error('Error fetching announcements:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  const categories = ['All', 'Academic', 'Exam', 'General', 'Holiday', 'Registration'];

  const filtered = announcements.filter((item) => {
    const matchesCat = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Title Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-school-50 text-school-800 text-xs font-semibold uppercase tracking-wider mb-2 border border-school-100">
          <Bell className="w-3.5 h-3.5" />
          <span>Official Communication Channel</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          School Announcements & Academic Notices
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Stay informed about official schedules, parent-teacher consultations, exams, and extracurricular events.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-school-900 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search notices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-school-600"
          />
        </div>
      </div>

      {/* Announcements List */}
      {loading ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <Loader2 className="w-8 h-8 text-school-700 animate-spin mx-auto mb-2" />
          <p className="text-sm text-slate-600">Loading notices...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">No notices found matching criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <article
              key={item._id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md bg-school-50 text-school-800 text-[11px] font-bold uppercase tracking-wider border border-school-100">
                    {item.category}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  {item.title}
                </h2>
                {item.titleAmharic && (
                  <h3 className="text-xs font-semibold text-school-800">
                    {item.titleAmharic}
                  </h3>
                )}

                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.content}
                </p>
                {item.contentAmharic && (
                  <p className="text-xs text-slate-500 italic leading-relaxed pt-2 border-t border-slate-100">
                    {item.contentAmharic}
                  </p>
                )}
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Audience: {item.targetAudience}</span>
                <span className="font-semibold text-school-700">Official Notice</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnnouncementsPage;
