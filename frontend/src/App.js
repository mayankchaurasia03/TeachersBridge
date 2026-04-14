import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from 'sonner';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import WalletPage from './pages/WalletPage';
import ProfilePage from './pages/ProfilePage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import RefundPolicy from './pages/RefundPolicy';
import ShippingPolicy from './pages/ShippingPolicy';
import ContactUs from './pages/ContactUs';
import { Loader2 } from 'lucide-react';
import './App.css';

function ProtectedRoute({ children, allowedRole }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#C4B5FD]" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" />;
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === 'student' ? '/dashboard' : '/teach'} />;
  }
  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#C4B5FD]" />
      </div>
    );
  }
  if (user) {
    return <Navigate to={user.role === 'student' ? '/dashboard' : '/teach'} />;
  }
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<PublicRoute><AuthPage mode="login" /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><AuthPage mode="signup" /></PublicRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute allowedRole="student"><StudentDashboard /></ProtectedRoute>} />
      <Route path="/teach" element={<ProtectedRoute allowedRole="teacher"><TeacherDashboard /></ProtectedRoute>} />
      <Route path="/wallet" element={<ProtectedRoute allowedRole="teacher"><WalletPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/profile/:userId" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsConditions />} />
      <Route path="/refund-policy" element={<RefundPolicy />} />
      <Route path="/shipping-policy" element={<ShippingPolicy />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster richColors position="top-right" />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
