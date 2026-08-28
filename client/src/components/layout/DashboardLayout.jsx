import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Award,
  BookOpen,
  FileSpreadsheet,
  FileText,
  Bell,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Shield,
  UserCheck,
  Calendar,
  Home,
  CheckCircle2,
  Search,
  Settings,
  CreditCard,
  Layers,
  Sparkles,
  RefreshCw,
  FolderKanban,
  Clock,
  BookMarked,
  Package,
  Activity,
  Languages,
  Moon,
  Sun,
  UserPlus,
  Compass,
} from 'lucide-react';

const DashboardLayout = ({ children, title, subtitle }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [langAmharic, setLangAmharic] = useState(false);

  // Complete list of SIMS modules matching Ethiopian Addis Ababa School Information Management System
  const allAdminLinks = [
    { name: langAmharic ? 'ዳሽቦርድ' : 'Dashboard', path: '/admin', icon: LayoutDashboard, gradient: 'from-blue-500 to-cyan-500' },
    { name: langAmharic ? 'ተማሪዎች' : 'Student', path: '/admin/students', icon: GraduationCap, gradient: 'from-cyan-500 to-teal-500' },
    { name: langAmharic ? 'መምህራን' : 'Teacher', path: '/admin/teachers', icon: Users, gradient: 'from-teal-500 to-emerald-500' },
    { name: langAmharic ? 'የክፍል ሽግግር' : 'Mass transfer', path: '/admin/classes', icon: Layers, gradient: 'from-indigo-500 to-blue-500' },
    { name: langAmharic ? 'አካዳሚክስ' : 'Academics', path: '/admin/classes', icon: BookOpen, gradient: 'from-purple-500 to-indigo-500' },
    { name: langAmharic ? 'የትምህርት እቅድ' : 'Lesson Plan', path: '/admin/lesson-plans', icon: FolderKanban, gradient: 'from-cyan-600 to-blue-600' },
    { name: langAmharic ? 'ተከታታይ ምዘና' : 'Assessment Schedule', path: '/admin/mastersheet', icon: Calendar, gradient: 'from-amber-500 to-orange-500' },
    { name: langAmharic ? 'ማስታወቂያ' : 'Announcement', path: '/admin/announcements', icon: Bell, gradient: 'from-rose-500 to-orange-500' },
    { name: langAmharic ? 'የተማሪዎች ክትትል' : 'Student Attendance', path: '/admin/attendance', icon: UserCheck, gradient: 'from-emerald-500 to-teal-600' },
    { name: langAmharic ? 'የትምህርት ቤት ንብረት' : 'Asset Management', path: '/admin/assets', icon: Package, gradient: 'from-amber-600 to-yellow-500' },
    { name: langAmharic ? 'የትምህርት ፕሮግራም' : 'Program / Timetable', path: '/admin/timetable', icon: Clock, gradient: 'from-blue-600 to-violet-600' },
    { name: langAmharic ? 'የተማሪ መታወቂያ' : 'ID Card', path: '/admin/id-cards', icon: CreditCard, gradient: 'from-sky-500 to-indigo-600' },
    { name: langAmharic ? 'የውጤት ካርድ' : 'Report Card Generate', path: '/admin/mastersheet', icon: FileText, gradient: 'from-emerald-600 to-teal-500' },
    { name: langAmharic ? 'ማስተር ሺት' : 'Master Mark Sheet', path: '/admin/mastersheet', icon: FileSpreadsheet, gradient: 'from-teal-600 to-cyan-600' },
    { name: langAmharic ? 'የክፍል ማለፊያ' : 'Promotion', path: '/admin/promotion', icon: Compass, gradient: 'from-rose-500 to-pink-600' },
  ];

  const teacherLinks = [
    { name: langAmharic ? 'ዳሽቦርድ' : 'Teacher Dashboard', path: '/teacher', icon: LayoutDashboard, gradient: 'from-blue-500 to-cyan-500' },
    { name: langAmharic ? 'የውጤት መመዝገቢያ' : 'Mark Entry & CA (50%)', path: '/teacher/grading', icon: FileSpreadsheet, gradient: 'from-teal-500 to-emerald-500' },
    { name: langAmharic ? 'የክፍል ደረጃ' : 'Class Rankings', path: '/teacher/rankings', icon: Award, gradient: 'from-amber-500 to-orange-500' },
    { name: langAmharic ? 'የተማሪዎች ክትትል' : 'Daily Attendance', path: '/teacher/attendance', icon: UserCheck, gradient: 'from-emerald-500 to-teal-600' },
    { name: langAmharic ? 'የትምህርት እቅድ' : 'Lesson Plans', path: '/teacher/lesson-plans', icon: FolderKanban, gradient: 'from-cyan-600 to-blue-600' },
    { name: langAmharic ? 'የተማሪ መታወቂያ' : 'Student ID Cards', path: '/admin/id-cards', icon: CreditCard, gradient: 'from-sky-500 to-indigo-600' },
    { name: langAmharic ? 'የክፍል ፕሮግራም' : 'Timetable', path: '/admin/timetable', icon: Clock, gradient: 'from-blue-600 to-violet-600' },
  ];

  const studentLinks = [
    { name: langAmharic ? 'ዳሽቦርድ' : 'Student Dashboard', path: '/student', icon: LayoutDashboard, gradient: 'from-blue-500 to-cyan-500' },
    { name: langAmharic ? 'የውጤት ካርድ' : 'Official Report Card', path: '/student/report-card', icon: FileText, gradient: 'from-emerald-600 to-teal-500' },
    { name: langAmharic ? 'የተማሪ መታወቂያ' : 'Digital ID Card', path: '/student/id-card', icon: CreditCard, gradient: 'from-sky-500 to-indigo-600' },
    { name: langAmharic ? 'የክትትል መዝገብ' : 'Attendance & Conduct', path: '/student/attendance', icon: UserCheck, gradient: 'from-teal-500 to-emerald-500' },
    { name: langAmharic ? 'የክፍል ፕሮግራም' : 'Weekly Timetable', path: '/student/timetable', icon: Clock, gradient: 'from-blue-600 to-violet-600' },
  ];

  const navLinks =
    user?.role === 'admin' || user?.role === 'registrar'
      ? allAdminLinks
      : user?.role === 'teacher'
      ? teacherLinks
      : studentLinks;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] flex flex-col font-sans text-slate-800">
      {/* Top Global SIMS Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between">
        {/* Left: School Emblem & Name */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-900 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight leading-none">
                Karadibayu Primary and Middle School
              </div>
              <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                የካራዲባዩ አንደኛና መካከለኛ ደረጃ ትምህርት ቤት • 2018 E.C.
              </div>
            </div>
          </Link>
        </div>

        {/* Right: Actions, Language Switcher, SIMS Badge, Profile */}
        <div className="flex items-center gap-3">
          {/* SIMS Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-full text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>SIMS PORTAL</span>
          </div>

          {/* Language Switch */}
          <button
            onClick={() => setLangAmharic(!langAmharic)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors"
            title="Toggle Language"
          >
            <Languages className="w-3.5 h-3.5 text-blue-600" />
            <span>{langAmharic ? 'EN' : 'አማ'}</span>
          </button>

          {/* User Profile Card */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center font-bold text-xs shadow">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-slate-900 truncate max-w-[120px]">
                {user?.fullName}
              </p>
              <p className="text-[10px] text-blue-700 font-bold uppercase tracking-wider">
                {user?.role}
              </p>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container: Sidebar + Main Content + Right Quick Dock */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar Navigation */}
        <aside
          className={`fixed md:static inset-y-0 left-0 top-[57px] md:top-0 z-30 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-3 overflow-y-auto flex-1 space-y-1">
            <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Main Menu</span>
              <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">
                2018 E.C.
              </span>
            </div>

            {navLinks.map((item, idx) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={idx}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-50/80 text-blue-700 font-bold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${item.gradient} text-white flex items-center justify-center shadow-xs shrink-0`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="truncate">{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                </Link>
              );
            })}
          </div>

          {/* Sidebar Footer */}
          <div className="p-3 border-t border-slate-100 bg-slate-50/60 text-xs">
            <Link
              to="/"
              className="flex items-center justify-center gap-2 w-full py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs"
            >
              <Home className="w-3.5 h-3.5 text-blue-600" />
              <span>Public School Website</span>
            </Link>
          </div>
        </aside>

        {/* Center Main Dashboard Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto min-w-0 max-w-7xl mx-auto w-full">
          {children}
        </main>

        {/* Right Quick Shortcuts Rail / Dock (Inspired by Addis Ababa SIMS) */}
        <aside className="hidden xl:flex w-16 bg-white border-l border-slate-200 flex-col items-center py-6 gap-4 shadow-2xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
            Shortcuts
          </div>

          <Link
            to={user?.role === 'admin' ? '/admin/students' : '/student'}
            title="Students Directory"
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-500 text-white flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
          >
            <GraduationCap className="w-5 h-5" />
          </Link>

          <Link
            to={user?.role === 'teacher' ? '/teacher/grading' : '/admin/mastersheet'}
            title="Mark Entry / Grades"
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
          >
            <FileSpreadsheet className="w-5 h-5" />
          </Link>

          <Link
            to="/admin/id-cards"
            title="Generate Student ID Cards"
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
          >
            <CreditCard className="w-5 h-5" />
          </Link>

          <Link
            to="/admin/timetable"
            title="Class Timetables"
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
          >
            <Clock className="w-5 h-5" />
          </Link>

          <Link
            to="/admin/assets"
            title="Textbook & Asset Inventory"
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
          >
            <Package className="w-5 h-5" />
          </Link>
        </aside>
      </div>
    </div>
  );
};

export default DashboardLayout;
