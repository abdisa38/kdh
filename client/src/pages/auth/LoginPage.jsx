import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap,
  Lock,
  User,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMessage('Please provide both username and password.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    const result = await login(username.trim(), password);

    if (result.success) {
      const role = result.user.role;
      if (role === 'admin' || role === 'registrar') {
        navigate('/admin');
      } else if (role === 'teacher') {
        navigate('/teacher');
      } else {
        navigate('/student');
      }
    } else {
      setErrorMessage(result.message);
      setLoading(false);
    }
  };

  const quickFillCredentials = (u, p) => {
    setUsername(u);
    setPassword(p);
    setErrorMessage('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-100">
      <div className="max-w-md w-full space-y-6">
        {/* Header & Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-school-900 text-white shadow-lg mb-2">
            <GraduationCap className="w-8 h-8 text-gold-400" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            KARADIBAYU PRIMARY SCHOOL
          </h1>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
            Institutional Management & Student Grade Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xl space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-800">Account Authentication</h2>
            <p className="text-xs text-slate-500">
              Sign in with your assigned Student ID or Staff credentials
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-rose-800 text-xs font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Username / Student ID Number
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. admin, teacher.abdisa, kps2026001"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-school-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-school-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-school-900 hover:bg-school-800 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-gold-400" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-gold-400" />
              )}
              <span>Authenticate & Enter Portal</span>
            </button>
          </form>

          {/* Quick Demo Fill Assistance */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase text-slate-500 mb-2.5">
              <HelpCircle className="w-3.5 h-3.5 text-school-700" />
              <span>Quick Demo Accounts (One-Click Test):</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => quickFillCredentials('admin', 'admin123')}
                className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-800 transition-colors text-center cursor-pointer"
              >
                Director (Admin)
              </button>
              <button
                type="button"
                onClick={() => quickFillCredentials('teacher.abdisa', 'teacher123')}
                className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-bold text-school-800 transition-colors text-center cursor-pointer"
              >
                Math Teacher
              </button>
              <button
                type="button"
                onClick={() => quickFillCredentials('kps2026001', 'kps123456')}
                className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-bold text-emerald-800 transition-colors text-center cursor-pointer"
              >
                Grade 7 Student
              </button>
            </div>
          </div>
        </div>

        {/* Public result shortcut */}
        <div className="text-center text-xs text-slate-500">
          Looking for fast grade lookup without logging in?{' '}
          <Link to="/check-results" className="text-school-700 font-bold hover:underline">
            Check Marks Online
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
