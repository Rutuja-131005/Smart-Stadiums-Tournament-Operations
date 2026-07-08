import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import FanDashboard from './pages/FanDashboard';
import Navigation from './pages/Navigation';
import Transport from './pages/Transport';
import VolunteerDashboard from './pages/VolunteerDashboard';
import OrganizerDashboard from './pages/OrganizerDashboard';
import SecurityDashboard from './pages/SecurityDashboard';
import SustainabilityDashboard from './pages/SustainabilityDashboard';
import Notifications from './pages/Notifications';
import Reports from './pages/Reports';
import NotFound from './pages/NotFound';
import LoadingSpinner from './components/common/LoadingSpinner';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading, hasRole } = useAuth();
  if (loading) return <LoadingSpinner fullScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !hasRole(...roles)) return <Navigate to="/dashboard" replace />;
  return children;
};

function App() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <>
      <a href="#main-content" className="sr-only sr-only-focusable">
        Skip to main content
      </a>
      <Routes>
        {/* Landing and Auth routes */}
        <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Landing />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />

        {/* Dashboard Layout wrapped routes */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/fan" element={<ProtectedRoute><FanDashboard /></ProtectedRoute>} />
          <Route path="/navigation" element={<ProtectedRoute><Navigation /></ProtectedRoute>} />
          <Route path="/transport" element={<ProtectedRoute><Transport /></ProtectedRoute>} />
          <Route path="/volunteer" element={<ProtectedRoute roles={['volunteer', 'staff', 'admin']}><VolunteerDashboard /></ProtectedRoute>} />
          <Route path="/organizer" element={<ProtectedRoute roles={['staff', 'admin']}><OrganizerDashboard /></ProtectedRoute>} />
          <Route path="/security" element={<ProtectedRoute roles={['security', 'admin']}><SecurityDashboard /></ProtectedRoute>} />
          <Route path="/sustainability" element={<ProtectedRoute><SustainabilityDashboard /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute roles={['staff', 'admin']}><Reports /></ProtectedRoute>} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
