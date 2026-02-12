import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles, theme } from './styles/theme';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';

// Auth Pages
import LandingPage from './pages/auth/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterRoleSelection from './pages/auth/RegisterRoleSelection';
import CandidateRegister from './pages/auth/CandidateRegister';
import EmployerRegister from './pages/auth/EmployerRegister';
import OTPVerification from './pages/auth/OTPVerification';
import PendingApproval from './pages/auth/PendingApproval';

// Candidate Pages
import CandidateDashboard from './pages/candidate/CandidateDashboard';
import JobListing from './pages/candidate/JobListing';
import JobDetail from './pages/candidate/JobDetail';
import SavedJobs from './pages/candidate/SavedJobs';
import CandidateProfile from './pages/candidate/CandidateProfile';
import CandidateSettings from './pages/candidate/CandidateSettings';
import CandidateNotifications from './pages/candidate/CandidateNotifications';
import CandidateMessages from './pages/candidate/CandidateMessages';

// Employer Pages
import EmployerDashboard from './pages/employer/EmployerDashboard';
import PostJob from './pages/employer/PostJob';
import JobManagement from './pages/employer/JobManagement';
import Applications from './pages/employer/Applications';
import EmployerProfile from './pages/employer/EmployerProfile';
import EmployerMessages from './pages/employer/EmployerMessages';
import EmployerNotifications from './pages/employer/EmployerNotifications';
import Subscription from './pages/employer/Subscription';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import EmployerApproval from './pages/admin/EmployerApproval';
import PackagesManagement from './pages/admin/PackagesManagement';
import Reports from './pages/admin/Reports';
import AdminSettings from './pages/admin/AdminSettings';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterRoleSelection />} />
      <Route path="/register/candidate" element={<CandidateRegister />} />
      <Route path="/register/employer" element={<EmployerRegister />} />
      <Route path="/verify-otp" element={<OTPVerification />} />
      <Route path="/pending-approval" element={<PendingApproval />} />
      
      {/* Candidate Routes */}
      <Route path="/candidate/dashboard" element={
        <ProtectedRoute allowedRoles={['candidate']}>
          <CandidateDashboard />
        </ProtectedRoute>
      } />
      <Route path="/candidate/jobs" element={
        <ProtectedRoute allowedRoles={['candidate']}>
          <JobListing />
        </ProtectedRoute>
      } />
      <Route path="/candidate/jobs/:id" element={
        <ProtectedRoute allowedRoles={['candidate']}>
          <JobDetail />
        </ProtectedRoute>
      } />
      <Route path="/candidate/saved-jobs" element={
        <ProtectedRoute allowedRoles={['candidate']}>
          <SavedJobs />
        </ProtectedRoute>
      } />
      <Route path="/candidate/profile" element={
        <ProtectedRoute allowedRoles={['candidate']}>
          <CandidateProfile />
        </ProtectedRoute>
      } />
      <Route path="/candidate/messages" element={
        <ProtectedRoute allowedRoles={['candidate']}>
          <CandidateMessages />
        </ProtectedRoute>
      } />
      <Route path="/candidate/notifications" element={
        <ProtectedRoute allowedRoles={['candidate']}>
          <CandidateNotifications />
        </ProtectedRoute>
      } />
      <Route path="/candidate/settings" element={
        <ProtectedRoute allowedRoles={['candidate']}>
          <CandidateSettings />
        </ProtectedRoute>
      } />
      
      {/* Employer Routes */}
      <Route path="/employer/dashboard" element={
        <ProtectedRoute allowedRoles={['employer']}>
          <EmployerDashboard />
        </ProtectedRoute>
      } />
      <Route path="/employer/post-job" element={
        <ProtectedRoute allowedRoles={['employer']}>
          <PostJob />
        </ProtectedRoute>
      } />
      <Route path="/employer/jobs" element={
        <ProtectedRoute allowedRoles={['employer']}>
          <JobManagement />
        </ProtectedRoute>
      } />
      <Route path="/employer/applications" element={
        <ProtectedRoute allowedRoles={['employer']}>
          <Applications />
        </ProtectedRoute>
      } />
      <Route path="/employer/profile" element={
        <ProtectedRoute allowedRoles={['employer']}>
          <EmployerProfile />
        </ProtectedRoute>
      } />
      <Route path="/employer/messages" element={
        <ProtectedRoute allowedRoles={['employer']}>
          <EmployerMessages />
        </ProtectedRoute>
      } />
      <Route path="/employer/notifications" element={
        <ProtectedRoute allowedRoles={['employer']}>
          <EmployerNotifications />
        </ProtectedRoute>
      } />
      <Route path="/employer/subscription" element={
        <ProtectedRoute allowedRoles={['employer']}>
          <Subscription />
        </ProtectedRoute>
      } />
      
      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <UserManagement />
        </ProtectedRoute>
      } />
      <Route path="/admin/employers" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <EmployerApproval />
        </ProtectedRoute>
      } />
      <Route path="/admin/packages" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <PackagesManagement />
        </ProtectedRoute>
      } />
      <Route path="/admin/reports" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Reports />
        </ProtectedRoute>
      } />
      <Route path="/admin/settings" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminSettings />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <AppRoutes />
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
