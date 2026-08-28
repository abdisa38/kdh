import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  GraduationCap,
  Search,
  BookOpen,
  Users,
  Award,
  Calendar,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Building,
  Sparkles,
  FileText,
  Clock,
  ChevronRight,
} from 'lucide-react';

const HomePage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [searchId, setSearchId] = useState('');
  const [loadingNews, setLoadingNews] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await api.get('/announcements/public');
        if (res.data?.success) {
          setAnnouncements(res.data.data);
        }
      } catch (error) {
        console.error('Failed to load announcements:', error);
      } finally {
        setLoadingNews(false);
      }
    };
    fetchAnnouncements();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchId.trim()) {
      navigate(`/check-results?id=${encodeURIComponent(searchId.trim())}`);
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-school-950 via-school-900 to-slate-900 text-white overflow-hidden py-20 lg:py-28 border-b border-school-800">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#369EFF_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-school-800/80 border border-school-700 text-gold-400 text-xs font-semibold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Official Ethiopian Ministry of Education Standard</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                KARADIBAYU <br />
                <span className="text-gold-400">PRIMARY SCHOOL</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl">
                ካራዲባዩ አንደኛ ደረጃ ትምህርት ቤት — Empowering young minds through structured academic excellence,
                continuous assessment, and moral integrity for Grades 1 through 8.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  to="/check-results"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-school-600 hover:bg-school-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-school-600/30 transition-all cursor-pointer"
                >
                  <Search className="w-4 h-4 text-gold-300" />
                  <span>Check Student Marks Online</span>
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-100 text-sm font-semibold rounded-xl border border-slate-700 transition-colors"
                >
                  <span>Staff & Student Portal</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </Link>
              </div>
            </div>

            {/* Right: Quick Result Verification Box */}
            <div className="lg:col-span-5">
              <div className="bg-white text-slate-900 rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-200">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-school-50 flex items-center justify-center text-school-700">
                    <Search className="w-5 h-5 text-school-700" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Online Result Lookup
                    </h2>
                    <p className="text-xs text-slate-500">
                      የተማሪ የውጤት መመልከቻ (Grades 1 - 8)
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSearchSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Student ID Number (የተማሪ መለያ ቁጥር)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. KPS/2026/001"
                      value={searchId}
                      onChange={(e) => setSearchId(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-school-600 focus:border-transparent transition-all uppercase"
                      required
                    />
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      Sample student IDs: <strong className="text-school-700">KPS/2026/001</strong> or <strong className="text-school-700">KPS/2026/002</strong>
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-school-900 hover:bg-school-800 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Search className="w-4 h-4 text-gold-400" />
                    <span>View Academic Report Card</span>
                  </button>
                </form>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Instant Semester 1 Results
                  </span>
                  <Link to="/about" className="text-school-700 hover:underline font-medium">
                    Need Help?
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Institutional Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-school-50 text-school-700 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">850+</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Enrolled Students
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">100%</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                MoE Curriculum Aligned
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">Grades 1-8</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Primary & Middle Cycles
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">35+</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Qualified Teachers
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Cycles Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-school-700 mb-2">
            Academic Programs
          </h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Ethiopian Standard Primary Education Framework
          </h3>
          <p className="text-sm text-slate-600 mt-2">
            Structured cycles designed to cultivate foundational literacy, numeracy, scientific inquiry, and social citizenship.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Cycle 1 */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-school-100 text-school-800 flex items-center justify-center font-bold text-sm mb-4">
              01
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">
              First Cycle (Grades 1 – 4)
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Focuses on mother-tongue reading fluency, foundational arithmetic, environmental exploration, physical education, and artistic expression.
            </p>
            <div className="text-xs font-semibold text-school-700 flex items-center gap-1.5">
              <span>Continuous Assessment (100% Activity Based)</span>
            </div>
          </div>

          {/* Cycle 2 */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-school-100 text-school-800 flex items-center justify-center font-bold text-sm mb-4">
              02
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">
              Second Cycle (Grades 5 – 6)
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Expands into English language mastery, advanced mathematics, environmental science, citizenship, and practical arts.
            </p>
            <div className="text-xs font-semibold text-school-700 flex items-center gap-1.5">
              <span>CA (50%) + Semester Final Exams (50%)</span>
            </div>
          </div>

          {/* Cycle 3 */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-school-100 text-school-800 flex items-center justify-center font-bold text-sm mb-4">
              03
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">
              Middle Cycle (Grades 7 – 8)
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Rigorous departmentalized curriculum including General Science, Social Studies, IT, CTE, preparing students for regional examinations.
            </p>
            <div className="text-xs font-semibold text-school-700 flex items-center gap-1.5">
              <span>Regional Examination & High School Readiness</span>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Official Announcements */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-school-700 mb-1">
              Official Notice Board
            </h2>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
              School News & Announcements
            </h3>
          </div>
          <Link
            to="/announcements"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-school-700 hover:text-school-900"
          >
            <span>View All Notices</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {announcements.slice(0, 3).map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-md bg-school-50 text-school-800 text-[11px] font-bold uppercase tracking-wider border border-school-100">
                    {item.category}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2 line-clamp-2">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                  {item.content}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Audience: {item.targetAudience}</span>
                <span className="font-semibold text-school-700">Official Release</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Leadership / Director Message */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-school-950 text-white rounded-3xl p-8 sm:p-12 border border-school-900 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-gold-400 uppercase tracking-widest">
                <Award className="w-4 h-4" />
                <span>Message from the School Administration</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                "Committed to Every Child's Academic & Moral Growth"
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                At Karadibayu Primary School, our focus is not merely on examinations, but on nurturing
                disciplined, curious, and capable young citizens. Through this unified digital portal,
                we provide transparent academic tracking so parents and teachers can work hand-in-hand
                to support every student.
              </p>
              <div className="pt-2">
                <div className="font-bold text-white text-base">Alemayehu Tadesse</div>
                <div className="text-xs text-slate-400">
                  School Director & Academic Committee Head • Karadibayu Primary School
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center">
              <div className="w-36 h-36 rounded-2xl bg-school-900 border-2 border-school-800 flex flex-col items-center justify-center p-4 text-center shadow-lg">
                <GraduationCap className="w-12 h-12 text-gold-400 mb-2" />
                <span className="text-xs font-bold text-white uppercase">Accredited Primary Institution</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
