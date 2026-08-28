import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PrintableReportCard from '../../components/report/PrintableReportCard';
import api from '../../services/api';
import { Loader2, Calendar } from 'lucide-react';

const StudentReportCardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [semester, setSemester] = useState('Semester 1');

  const fetchReportCard = async (selectedSem) => {
    setLoading(true);
    try {
      const res = await api.get(`/students/me/results?semester=${selectedSem}`);
      if (res.data?.success) {
        setData(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching report card:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportCard(semester);
  }, [semester]);

  return (
    <DashboardLayout
      title="Official Academic Report Card"
      subtitle="Ministry of Education Standard Primary School Card (የተማሪ የውጤት ካርድ)"
    >
      <div className="space-y-6">
        {/* Term Selection */}
        <div className="no-print bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <Calendar className="w-4 h-4 text-school-700" />
            <span>Select Term / Semester:</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setSemester('Semester 1')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                semester === 'Semester 1'
                  ? 'bg-school-900 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Semester 1 (የመጀመሪያ ወሰነ-ትምህርት)
            </button>
            <button
              onClick={() => setSemester('Semester 2')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                semester === 'Semester 2'
                  ? 'bg-school-900 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Semester 2 (የሁለተኛ ወሰነ-ትምህርት)
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <Loader2 className="w-8 h-8 text-school-700 animate-spin mx-auto mb-2" />
            <p className="text-sm text-slate-600">Generating report card...</p>
          </div>
        ) : (
          <PrintableReportCard
            reportCard={data?.reportCard}
            student={data?.student}
            academicYear={data?.academicYear}
            semester={semester}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentReportCardPage;
