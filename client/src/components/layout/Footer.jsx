import React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Award,
  BookOpen,
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-school-950 text-slate-300 border-t border-school-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: School Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-school-800 flex items-center justify-center text-white shadow">
                <GraduationCap className="w-6 h-6 text-gold-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Karadibayu Primary School
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  ካራዲባዩ አንደኛ ደረጃ ትምህርት ቤት
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Dedicated to academic excellence, ethical character building, and comprehensive
              primary education (Grades 1 to 8) under the Ethiopian Ministry of Education framework.
            </p>
            <div className="flex items-center gap-2 text-xs text-gold-400 font-medium bg-school-900/60 p-2.5 rounded-lg border border-school-800">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Official Academic & Examination Portal</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white border-b border-school-800 pb-2">
              Portals & Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/check-results"
                  className="hover:text-gold-400 transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400"></span>
                  Online Student Mark Verification
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="hover:text-gold-400 transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                  Teacher & Staff Portal
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="hover:text-gold-400 transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                  Student & Parent Portal
                </Link>
              </li>
              <li>
                <Link
                  to="/announcements"
                  className="hover:text-gold-400 transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                  School Notice Board & Events
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Academic Structure */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white border-b border-school-800 pb-2">
              Academic Structure
            </h4>
            <div className="space-y-2 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-school-400 shrink-0" />
                <span>Primary First Cycle: Grades 1 - 4</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-school-400 shrink-0" />
                <span>Primary Second Cycle: Grades 5 - 6</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-school-400 shrink-0" />
                <span>Middle Primary Cycle: Grades 7 - 8</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-gold-400 shrink-0" />
                <span>Ministry Curriculum & Continuous Assessment</span>
              </div>
            </div>
          </div>

          {/* Column 4: Contact & Office */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white border-b border-school-800 pb-2">
              Contact & Location
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span>Karadibayu Primary School Campus, Ethiopia</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <span>+251 91 100 0000 / +251 92 200 0000</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                <span>contact@karadibayu.edu.et</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-gold-400 shrink-0" />
                <span>Mon - Fri: 8:00 AM - 4:30 PM (EAT)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-school-900 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Karadibayu Primary School. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span>Powered by Enterprise MERN Stack</span>
            <span>•</span>
            <span className="text-slate-400">Ethiopian MoE Primary School Standard</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
