import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import api from '../../services/api';
import {
  CreditCard,
  Printer,
  Search,
  GraduationCap,
  ShieldCheck,
  Loader2,
  Barcode,
  Calendar,
  Filter,
} from 'lucide-react';

const IdCardGeneratorPage = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [classRes, studRes] = await Promise.all([
          api.get('/academic/classes'),
          api.get('/students'),
        ]);

        if (classRes.data?.success && classRes.data.data.length > 0) {
          setClasses(classRes.data.data);
          setSelectedClass(classRes.data.data[0]._id);
        }
        if (studRes.data?.success) {
          setStudents(studRes.data.data);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredStudents = selectedClass
    ? students.filter((s) => s.currentClass?._id === selectedClass)
    : students;

  const handlePrint = () => {
    window.print();
  };

  const avatarGradients = [
    'from-blue-700 to-indigo-900',
    'from-emerald-700 to-teal-900',
    'from-purple-700 to-indigo-900',
    'from-amber-700 to-orange-900',
  ];

  return (
    <DashboardLayout
      title="Student ID Card Generator (የተማሪዎች መታወቂያ)"
      subtitle="Official printable student identity cards with Ethiopian curriculum validation and barcode"
    >
      <div className="space-y-6">
        {/* Top Control Bar (Hidden on Print) */}
        <div className="no-print bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-60">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Filter by Class Section
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
              >
                <option value="">All Classes (All Students)</option>
                {classes.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <span className="text-xs text-slate-500 font-semibold pt-5">
              {filteredStudents.length} ID Cards Ready
            </span>
          </div>

          <button
            onClick={handlePrint}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Print Student ID Batch</span>
          </button>
        </div>

        {loading ? (
          <div className="py-24 text-center bg-white rounded-2xl border border-slate-200">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-500 font-medium">Generating ID cards...</p>
          </div>
        ) : (
          /* Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student, idx) => {
              const gradient = avatarGradients[idx % avatarGradients.length];

              return (
                <div
                  key={student._id}
                  className="bg-white border-2 border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 print:border-2 print:border-black print:break-inside-avoid relative overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="flex items-center gap-3 border-b-2 border-slate-800 pb-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black">
                      <GraduationCap className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <div className="text-[11px] font-black tracking-tight text-slate-950 uppercase leading-none">
                        KARADIBAYU PRIMARY SCHOOL
                      </div>
                      <div className="text-[10px] font-bold text-blue-800">
                        ካራዲባዩ አንደኛ ደረጃ ትምህርት ቤት
                      </div>
                      <div className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
                        STUDENT IDENTITY CARD • 2018 E.C.
                      </div>
                    </div>
                  </div>

                  {/* Card Body: Photo & Biodata */}
                  <div className="grid grid-cols-12 gap-3 items-center">
                    {/* Photo Box */}
                    <div className="col-span-4 flex flex-col items-center">
                      <div
                        className={`w-20 h-24 rounded-xl bg-gradient-to-tr ${gradient} text-white flex flex-col items-center justify-center shadow-inner border-2 border-slate-800`}
                      >
                        <span className="text-2xl font-black">{student.firstName?.charAt(0)}</span>
                        <span className="text-[8px] font-bold tracking-widest uppercase mt-1 opacity-80">
                          STUDENT
                        </span>
                      </div>
                      <span className="text-[8px] font-mono text-slate-400 mt-1">
                        #{student.rollNumber || idx + 1}
                      </span>
                    </div>

                    {/* Biodata */}
                    <div className="col-span-8 space-y-1 text-xs">
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400 block">
                          Full Name:
                        </span>
                        <div className="font-black text-slate-950 text-xs truncate">
                          {student.firstName} {student.middleName} {student.lastName}
                        </div>
                        {student.firstNameAmharic && (
                          <div className="text-[10px] text-slate-600 font-semibold truncate">
                            {student.firstNameAmharic} {student.middleNameAmharic}{' '}
                            {student.lastNameAmharic}
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-1 pt-1">
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-400 block">
                            ID Number:
                          </span>
                          <span className="font-mono font-black text-blue-800 text-[11px]">
                            {student.studentIdNumber}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-400 block">
                            Grade / Section:
                          </span>
                          <span className="font-bold text-slate-900 text-[11px]">
                            {student.currentClass?.name || 'Grade 7-A'}
                          </span>
                        </div>
                      </div>

                      <div className="pt-1">
                        <span className="text-[9px] uppercase font-bold text-slate-400 block">
                          Emergency Contact:
                        </span>
                        <span className="font-mono text-slate-700 font-bold text-[10px]">
                          {student.parentPhone}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Barcode & Seal */}
                  <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-[8px] text-slate-500 font-mono">
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-800 tracking-wider">
                        ||||| | |||| || |||||| | |||||
                      </div>
                      <span>VALID: 2018 - 2019 E.C.</span>
                    </div>
                    <div className="text-right">
                      <div className="font-serif italic font-bold text-slate-800">Alemayehu T.</div>
                      <span className="text-[8px] uppercase">Principal Seal</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default IdCardGeneratorPage;
