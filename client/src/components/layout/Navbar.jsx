import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap,
  Search,
  LogIn,
  LogOut,
  User,
  LayoutDashboard,
  Menu,
  X,
  BookOpen,
  Bell,
  Info,
  Phone,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'admin' || user.role === 'registrar') return '/admin';
    if (user.role === 'teacher') return '/teacher';
    return '/student';
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About School', path: '/about' },
    { name: 'Announcements', path: '/announcements' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      {/* Top emergency / quick info notice bar */}
      <div className="bg-school-950 text-slate-200 text-xs py-1.5 px-4 sm:px-8 flex justify-between items-center border-b border-school-900">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-gold-400 flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Academic Year: 2026/2018 E.C. (Semester 1 Active)
          </span>
          <span className="hidden md:inline text-slate-400">|</span>
          <span className="hidden md:inline text-slate-300">
            Karadibayu Primary School (ካራዲባዩ አንደኛ ደረጃ ት/ቤት)
          </span>
        </div>
        <div className="flex items-center gap-4 text-slate-300">
          <Link
            to="/check-results"
            className="hover:text-gold-400 flex items-center gap-1 font-medium transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            Online Mark Verification
          </Link>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo & School Name */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-school-900 text-white flex items-center justify-center shadow-md group-hover:bg-school-800 transition-colors">
              <GraduationCap className="w-7 h-7 text-gold-400" />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900 tracking-tight leading-none group-hover:text-school-700 transition-colors">
                KARADIBAYU
              </div>
              <div className="text-xs font-semibold text-school-700 uppercase tracking-wider mt-0.5">
                Primary School Portal
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                ካራዲባዩ አንደኛ ደረጃ ትምህርት ቤት
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-school-700 bg-school-50 font-semibold'
                      : 'text-slate-600 hover:text-school-700 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/check-results"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-school-50 text-school-700 text-sm font-semibold border border-school-200 hover:bg-school-100 transition-colors shadow-sm"
            >
              <Search className="w-4 h-4 text-school-700" />
              Check Marks
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <Link
                  to={getDashboardLink()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-school-900 text-white text-sm font-semibold hover:bg-school-800 transition-colors shadow-sm"
                >
                  <LayoutDashboard className="w-4 h-4 text-gold-400" />
                  <span>My Portal</span>
                  <span className="text-[11px] px-2 py-0.5 bg-school-800 rounded text-slate-200 uppercase font-bold tracking-wider">
                    {user.role}
                  </span>
                </Link>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-school-900 text-white text-sm font-semibold hover:bg-school-800 transition-colors shadow-sm"
              >
                <LogIn className="w-4 h-4" />
                Portal Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <Link
              to="/check-results"
              className="p-2 text-school-700 hover:bg-school-50 rounded-lg"
              title="Check Results"
            >
              <Search className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-lg space-y-3">
          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-base font-medium ${
                  location.pathname === link.path
                    ? 'text-school-700 bg-school-50 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/check-results"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-base font-medium text-school-700 bg-school-50 flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Online Mark Verification
            </Link>
          </div>

          <div className="pt-3 border-t border-slate-200">
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link
                  to={getDashboardLink()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-school-900 text-white font-medium shadow"
                >
                  <LayoutDashboard className="w-4 h-4 text-gold-400" />
                  Enter Dashboard ({user.role})
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-rose-600 bg-rose-50 font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-school-900 text-white font-medium shadow"
              >
                <LogIn className="w-4 h-4" />
                Staff / Student Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
