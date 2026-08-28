import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import api from '../../services/api';
import {
  Clock,
  Calendar,
  BookOpen,
  User,
  Loader2,
  Printer,
  Sparkles,
} from 'lucide-react';

const TimetablePage = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [loading, setLoading] = useState(false);

  const periods = [
    { num: 1, time: '08:30 - 09:15 AM' },
    { num: 2, time: '09:15 - 10:00 AM' },
    { num: 3, time: '10:15 - 11:00 AM' },
    { num: 4, time: '11:00 - 11:45 AM' },
    { num: 5, time: '12:45 - 01:30 PM' },
    { num: 6, time: '01:30 - 02:15 PM' },
    { num: 7, time: '02:30 - 03:15 PM' },
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const scheduleGrid = {
    Monday: [
      { subj: 'Mathematics (ሒሳብ)', teacher: 'A. Awel', room: '102' },
      { subj: 'English Language', teacher: 'S. Kebede', room: '102' },
      { subj: 'General Science', teacher: 'T. Mengistu', room: 'Lab 3' },
      { subj: 'Social Studies', teacher: 'C. Gemechu', room: '102' },
      { subj: 'Amharic Language', teacher: 'T. Bekele', room: '102' },
      { subj: 'IT / Computer', teacher: 'H. Desta', room: 'ICT Lab' },
      { subj: 'PVA (ስነ-ጥበባት)', teacher: 'A. Awel', room: '102' },
    ],
    Tuesday: [
      { subj: 'General Science', teacher: 'T. Mengistu', room: 'Lab 3' },
      { subj: 'Mathematics (ሒሳብ)', teacher: 'A. Awel', room: '102' },
      { subj: 'English Language', teacher: 'S. Kebede', room: '102' },
      { subj: 'Citizenship (ዜግነት)', teacher: 'C. Gemechu', room: '102' },
      { subj: 'HPE / Sports', teacher: 'M. Tadesse', room: 'Field' },
      { subj: 'Career & Tech (CTE)', teacher: 'H. Desta', room: '102' },
      { subj: 'Amharic Language', teacher: 'T. Bekele', room: '102' },
    ],
    Wednesday: [
      { subj: 'Mathematics (ሒሳብ)', teacher: 'A. Awel', room: '102' },
      { subj: 'Amharic Language', teacher: 'T. Bekele', room: '102' },
      { subj: 'General Science', teacher: 'T. Mengistu', room: 'Lab 3' },
      { subj: 'English Language', teacher: 'S. Kebede', room: '102' },
      { subj: 'Social Studies', teacher: 'C. Gemechu', room: '102' },
      { subj: 'IT / Computer', teacher: 'H. Desta', room: 'ICT Lab' },
      { subj: 'Library Period', teacher: 'Librarian', room: 'Lib' },
    ],
    Thursday: [
      { subj: 'English Language', teacher: 'S. Kebede', room: '102' },
      { subj: 'Mathematics (ሒሳብ)', teacher: 'A. Awel', room: '102' },
      { subj: 'Citizenship (ዜግነት)', teacher: 'C. Gemechu', room: '102' },
      { subj: 'General Science', teacher: 'T. Mengistu', room: 'Lab 3' },
      { subj: 'Amharic Language', teacher: 'T. Bekele', room: '102' },
      { subj: 'PVA (ስነ-ጥበባት)', teacher: 'A. Awel', room: '102' },
      { subj: 'Career & Tech (CTE)', teacher: 'H. Desta', room: '102' },
    ],
    Friday: [
      { subj: 'Mathematics (ሒሳብ)', teacher: 'A. Awel', room: '102' },
      { subj: 'English Language', teacher: 'S. Kebede', room: '102' },
      { subj: 'General Science', teacher: 'T. Mengistu', room: 'Lab 3' },
      { subj: 'HPE / Sports', teacher: 'M. Tadesse', room: 'Field' },
      { subj: 'Social Studies', teacher: 'C. Gemechu', room: '102' },
      { subj: 'Co-curricular Clubs', teacher: 'All Staff', room: 'Hall' },
      { subj: 'Classroom Assembly', teacher: 'A. Awel', room: '102' },
    ],
  };

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await api.get('/academic/classes');
        if (res.data?.success && res.data.data.length > 0) {
          setClasses(res.data.data);
          setSelectedClass(res.data.data[0]._id);
        }
      } catch (err) {
        console.error('Error:', err);
      }
    };
    fetchClasses();
  }, []);

  return (
    <DashboardLayout
      title="Classroom Timetable & Period Schedules (የትምህርት ፕሮግራም)"
      subtitle="Period 1-7 master schedule compliant with Ethiopian primary school curriculum"
    >
      <div className="space-y-6">
        <div className="no-print bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-64">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Select Classroom
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
              >
                {classes.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} (Grade {c.gradeLevel} - {c.section})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={() => window.print()}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Print Timetable Sheet</span>
          </button>
        </div>

        {/* Timetable Matrix Grid */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden print:border-none">
          <div className="p-4 bg-slate-900 text-white flex justify-between items-center text-xs">
            <div className="flex items-center gap-2 font-bold">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Weekly Period Schedule • 7 Periods Daily • 2018 E.C.</span>
            </div>
            <span className="text-slate-400 font-semibold">Morning & Afternoon Cycles</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-3 w-28 text-center">Period & Time</th>
                  {days.map((day) => (
                    <th key={day} className="p-3 text-center min-w-[140px]">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {periods.map((p, pIdx) => (
                  <tr key={p.num} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 bg-slate-50/70 text-center border-r border-slate-100">
                      <span className="font-black text-xs text-blue-700 block">
                        Period {p.num}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">{p.time}</span>
                    </td>

                    {days.map((day) => {
                      const item = scheduleGrid[day][pIdx];
                      return (
                        <td key={day} className="p-2.5 text-center">
                          <div className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200/60 transition-colors">
                            <div className="font-bold text-slate-900 text-[11px] truncate">
                              {item?.subj}
                            </div>
                            <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1 pt-1 border-t border-slate-100">
                              <span>{item?.teacher}</span>
                              <span className="font-mono bg-slate-200/60 px-1 rounded text-[9px]">
                                Rm {item?.room}
                              </span>
                            </div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TimetablePage;
