import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import BookAppointment from './pages/BookAppointment';
import MedicalRecords from './pages/MedicalRecords';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={<Home />} />

      {/* Public Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected Dashboard Routes */}
      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<PatientDashboard />} />
        <Route path="/appointments" element={<BookAppointment />} />
        <Route path="/records" element={<MedicalRecords />} />
        <Route path="/doctors" element={<div className='p-8'><h1 className="text-2xl font-bold">Doctors Directory</h1><p className="text-gray-500">Coming soon...</p></div>} />
        <Route path="/ai-chat" element={<div className='p-8'><h1 className="text-2xl font-bold">AI Health Assistant</h1><p className="text-gray-500">Coming soon...</p></div>} />
        <Route path="/messages" element={<div className='p-8'><h1 className="text-2xl font-bold">Messages</h1><p className="text-gray-500">Coming soon...</p></div>} />
        <Route path="/profile" element={<div className='p-8'><h1 className="text-2xl font-bold">Profile</h1><p className="text-gray-500">Coming soon...</p></div>} />
        <Route path="/settings" element={<div className='p-8'><h1 className="text-2xl font-bold">Settings</h1><p className="text-gray-500">Coming soon...</p></div>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
