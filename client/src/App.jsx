import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/common/LoadingSpinner';

// ── Lazy-loaded page components (route-based code splitting) ──────────────
const Landing = lazy(() => import('./pages/Landing'));
const Home = lazy(() => import('./pages/Home'));
const FanDashboard = lazy(() => import('./pages/FanDashboard'));
const Navigation = lazy(() => import('./pages/Navigation'));
const Transport = lazy(() => import('./pages/Transport'));
const VolunteerDashboard = lazy(() => import('./pages/VolunteerDashboard'));
const OrganizerDashboard = lazy(() => import('./pages/OrganizerDashboard'));
const SecurityDashboard = lazy(() => import('./pages/SecurityDashboard'));
const SustainabilityDashboard = lazy(() => import('./pages/SustainabilityDashboard'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Reports = lazy(() => import('./pages/Reports'));
const NotFound = lazy(() => import('./pages/NotFound'));

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading, hasRole } = useAuth();
  if (loading) return <LoadingSpinner fullScreen />;
  if (!user) return <Navigate to="/" replace />;
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
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        <Routes>
          {/* Landing and Auth routes */}
          <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Landing />} />

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
      </Suspense>
    </>
  );
}

export default App;
