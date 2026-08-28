import React from 'react';
import {
  GraduationCap,
  Award,
  Target,
  Eye,
  CheckCircle2,
  Users,
  Building,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Title Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-school-50 text-school-800 text-xs font-semibold uppercase tracking-wider mb-3 border border-school-100">
          <Building className="w-4 h-4" />
          <span>About Karadibayu Primary School</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Nurturing Academic Excellence & Ethical Character Since Foundation
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
          ካራዲባዩ አንደኛ ደረጃ ትምህርት ቤት is a premier Ethiopian primary institution committed to providing wholesome, high-caliber, and inclusive education for children in Grades 1 through 8.
        </p>
      </div>

      {/* Mission & Vision Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="w-12 h-12 rounded-xl bg-school-100 text-school-800 flex items-center justify-center mb-4">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-3">Our Mission (ተልዕኮ)</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            To provide high-quality primary education that empowers students with literacy, numeracy, critical scientific inquiry, and ethical civic responsibility, preparing them seamlessly for secondary education and lifelong success.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="w-12 h-12 rounded-xl bg-gold-100 text-gold-700 flex items-center justify-center mb-4">
            <Eye className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-3">Our Vision (ራዕይ)</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            To be a model primary school in the region renowned for exceptional academic achievement, innovative classroom practices, equitable student development, and active parental collaboration.
          </p>
        </div>
      </div>

      {/* Core Academic Values */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800">
        <h2 className="text-xs font-bold uppercase tracking-widest text-gold-400 mb-2">
          Institutional Pillars
        </h2>
        <h3 className="text-2xl font-bold tracking-tight mb-8">
          Core Values That Guide Our Daily Teaching & Student Guidance
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-5 rounded-xl bg-slate-800/80 border border-slate-700">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 mb-2" />
            <h4 className="font-bold text-base text-white mb-1">Academic Rigor</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Adherence to rigorous pedagogical standards with continuous assessment and supportive remedial programs.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-800/80 border border-slate-700">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 mb-2" />
            <h4 className="font-bold text-base text-white mb-1">Integrity & Conduct</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Fostering honesty, respectful citizenship, mutual empathy, and moral behavior in every classroom.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-800/80 border border-slate-700">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 mb-2" />
            <h4 className="font-bold text-base text-white mb-1">Parental Transparency</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Direct digital access to student grades, continuous attendance tracking, and prompt feedback on student progress.
            </p>
          </div>
        </div>
      </div>

      {/* Academic Curriculum Framework */}
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-school-50 text-school-800 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Ethiopian Ministry of Education (MoE) Standard Curriculum
            </h2>
            <p className="text-xs text-slate-500">
              Aligned with national standards for primary education
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold block text-sm text-school-900 mb-1">
              Assessment Weighting Formula
            </span>
            <p className="leading-relaxed">
              Continuous Assessment (50%): Quizzes, Homework, Class Participation, Practical Project & Mid-Term Exam.<br />
              Final Examination (50%): Comprehensive semester evaluation.
            </p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold block text-sm text-school-900 mb-1">
              Academic Term Division
            </span>
            <p className="leading-relaxed">
              Semester 1 (የመጀመሪያ ወሰነ-ትምህርት): September to January.<br />
              Semester 2 (የሁለተኛ ወሰነ-ትምህርት): February to June, culminating in annual composite rank calculation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
