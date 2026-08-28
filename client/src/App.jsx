import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Public Pages
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import AnnouncementsPage from './pages/public/AnnouncementsPage';
import ContactPage from './pages/public/ContactPage';
import PublicResultCheckerPage from './pages/public/PublicResultCheckerPage';
import LoginPage from './pages/auth/LoginPage';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentReportCardPage from './pages/student/StudentReportCardPage';
import StudentAttendancePage from './pages/student/StudentAttendancePage';

// Teacher Pages
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import MarksheetEntryPage from './pages/teacher/MarksheetEntryPage';
import ClassRankingPage from './pages/teacher/ClassRankingPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentsManagementPage from './pages/admin/StudentsManagementPage';
import TeachersManagementPage from './pages/admin/TeachersManagementPage';
import ClassRoomsPage from './pages/admin/ClassRoomsPage';
import MasterSheetPage from './pages/admin/MasterSheetPage';
import AnnouncementsAdminPage from './pages/admin/AnnouncementsAdminPage';

// Public Layout Wrapper with Navbar & Footer
const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Pages Layout */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/announcements" element={<AnnouncementsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/check-results" element={<PublicResultCheckerPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Route>

          {/* Student Protected Portal */}
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/report-card"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentReportCardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/attendance"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentAttendancePage />
              </ProtectedRoute>
            }
          />

          {/* Teacher Protected Portal */}
          <Route
            path="/teacher"
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/grading"
            element={
              <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                <MarksheetEntryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/rankings"
            element={
              <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                <ClassRankingPage />
              </ProtectedRoute>
            }
          />

          {/* Admin & Registrar Protected Portal */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin', 'registrar']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/students"
            element={
              <ProtectedRoute allowedRoles={['admin', 'registrar']}>
                <StudentsManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/teachers"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <TeachersManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/classes"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ClassRoomsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/mastersheet"
            element={
              <ProtectedRoute allowedRoles={['admin', 'teacher', 'registrar']}>
                <MasterSheetPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/announcements"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AnnouncementsAdminPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
