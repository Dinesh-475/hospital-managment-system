import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/auth/Login';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import DashboardLayout from './layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import { Toaster } from 'sonner';

import { useSelector } from 'react-redux';
import { RootState } from './store';

// Placeholder pages
const Patients = () => <div className="p-4 text-2xl font-bold text-gray-500">Patients Page (Coming Soon)</div>;
const Doctors = () => <div className="p-4 text-2xl font-bold text-gray-500">Doctors Page (Coming Soon)</div>;
const Appointments = () => <div className="p-4 text-2xl font-bold text-gray-500">Appointments Page (Coming Soon)</div>;
const Settings = () => <div className="p-4 text-2xl font-bold text-gray-500">Settings Page (Coming Soon)</div>;
const AttendancePage = () => <div className="p-4 text-2xl font-bold text-gray-500">Attendance Page (Coming Soon)</div>;


import { DoctorList } from './pages/appointments/DoctorList';

function App() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <>
      <Toaster position="bottom-right" />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Protected Routes */}
        {isAuthenticated ? (
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="patients" element={<Patients />} />
            <Route path="doctors" element={<Doctors />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="appointments/book" element={<DoctorList />} />
            <Route path="records" element={<div className="p-8"><h2 className="text-2xl font-bold">Medical Records</h2><p className="mt-4">Patient records will appear here.</p></div>} />
            <Route path="messages" element={<div className="p-8"><h2 className="text-2xl font-bold">Messages</h2><p className="mt-4">Your conversations will appear here.</p></div>} />
            <Route path="vitals" element={<div className="p-8"><h2 className="text-2xl font-bold">Health Vitals</h2><p className="mt-4">Track your vital signs here.</p></div>} />
            <Route path="settings" element={<Settings />} />
            <Route path="attendance" element={<AttendancePage />} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </>
  );
}

export default App;
