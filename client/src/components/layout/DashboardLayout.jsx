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
} from 'lucide-react';

const DashboardLayout = ({ children, title, subtitle }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getNavLinks = () => {
    if (user?.role === 'admin' || user?.role === 'registrar') {
      return [
        { name: 'Overview', path: '/admin', icon: LayoutDashboard },
        { name: 'Student Records', path: '/admin/students', icon: GraduationCap },
        { name: 'Teaching Staff', path: '/admin/teachers', icon: Users },
        { name: 'Classes & Sections', path: '/admin/classes', icon: BookOpen },
        { name: 'Master Sheet & Ranking', path: '/admin/mastersheet', icon: FileSpreadsheet },
        { name: 'Announcements', path: '/admin/announcements', icon: Bell },
      ];
    } else if (user?.role === 'teacher') {
      return [
        { name: 'Teacher Overview', path: '/teacher', icon: LayoutDashboard },
        { name: 'Marksheet & Grade Entry', path: '/teacher/grading', icon: FileSpreadsheet },
        { name: 'Class Rankings & Conduct', path: '/teacher/rankings', icon: Award },
      ];
    } else {
      return [
        { name: 'Student Dashboard', path: '/student', icon: LayoutDashboard },
        { name: 'Official Report Card', path: '/student/report-card', icon: FileText },
        { name: 'Attendance & Conduct', path: '/student/attendance', icon: UserCheck },
      ];
    }
  };

  const navLinks = getNavLinks();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-school-950 text-white px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5">
          <GraduationCap className="w-6 h-6 text-gold-400" />
          <span className="font-bold tracking-tight text-sm">KARADIBAYU PORTAL</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-lg hover:bg-school-800 text-slate-200"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-72 bg-school-950 text-slate-300 flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Sidebar Header / Institution Seal */}
          <div className="p-6 border-b border-school-900">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-school-800 flex items-center justify-center text-white shadow-inner">
                <GraduationCap className="w-6 h-6 text-gold-400" />
              </div>
              <div>
                <h1 className="text-base font-bold text-white tracking-tight leading-none">
                  KARADIBAYU
                </h1>
                <p className="text-xs text-school-400 uppercase font-semibold tracking-wider mt-1">
                  Primary School
                </p>
              </div>
            </Link>

            {/* Active Academic Term Badge */}
            <div className="mt-4 px-3 py-2 rounded-lg bg-school-900/80 border border-school-800 flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-1.5 font-medium">
                <Calendar className="w-3.5 h-3.5 text-gold-400" />
                <span>2026/2018 E.C.</span>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-semibold text-[10px] border border-emerald-800">
                Semester 1
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {user?.role} Portal Navigation
            </div>
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-school-700 text-white font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-school-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-gold-400' : 'text-slate-400'}`} />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 text-gold-400" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: User Profile & Logout */}
        <div className="p-4 border-t border-school-900 bg-school-950/80 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-school-800 flex items-center justify-center font-bold text-sm text-gold-400 border border-school-700">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user?.fullName}</p>
              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                <span className="capitalize font-semibold text-gold-400">{user?.role}</span>
                <span>•</span>
                <span className="truncate">{user?.username}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-school-900">
            <Link
              to="/"
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-school-900 text-slate-300 text-xs font-medium hover:bg-school-800 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              Website
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-rose-950/60 text-rose-300 border border-rose-900 text-xs font-medium hover:bg-rose-900/60 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar for dashboard */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-xs">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h2>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-600">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>System Status: Online</span>
            </div>
            <Link
              to="/check-results"
              className="px-3 py-1.5 bg-school-50 text-school-700 border border-school-200 rounded-lg text-xs font-semibold hover:bg-school-100 transition-colors"
            >
              Quick Result Lookup
            </Link>
          </div>
        </header>

        {/* Dashboard Dynamic Content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
