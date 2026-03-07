import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles, theme, darkTheme } from './styles/theme';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider as CustomThemeProvider, useTheme } from './context/ThemeContext';
import ScrollToTop from './components/ScrollToTop';

// Auth Pages
import LandingPage from './pages/auth/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterRoleSelection from './pages/auth/RegisterRoleSelection';
import CandidateRegister from './pages/auth/CandidateRegister';
import EmployerRegister from './pages/auth/EmployerRegister';
import OTPVerification from './pages/auth/OTPVerification';
import PendingApproval from './pages/auth/PendingApproval';
import DownloadApp from './pages/auth/DownloadApp';
import ForgotPassword from './pages/auth/ForgotPassword';

// Candidate Pages
import CandidateDashboard from './pages/candidate/CandidateDashboard';
import JobListing from './pages/candidate/JobListing';
import SavedJobs from './pages/candidate/SavedJobs';
import CandidateProfile from './pages/candidate/CandidateProfile';
import CandidateSettings from './pages/candidate/CandidateSettings';
import CandidateNotifications from './pages/candidate/CandidateNotifications';
import EmployerProfileView from './pages/candidate/EmployerProfileView';
import Support from './pages/candidate/Support';
import Wallet from './pages/candidate/Wallet';
import Availability from './pages/candidate/Availability';
import CandidatePosts from './pages/candidate/CandidatePosts';
import ChangePassword from './pages/candidate/ChangePassword';
import DeleteAccount from './pages/candidate/DeleteAccount';
import CandidateKYC from './pages/candidate/CandidateKYC';

// Employer Pages
import EmployerDashboard from './pages/employer/EmployerDashboard';
import PostJob from './pages/employer/PostJob';
import CompanyVerification from './pages/employer/CompanyVerification';
import JobManagement from './pages/employer/JobManagement';
import Applications from './pages/employer/Applications';
import EmployerProfile from './pages/employer/EmployerProfile';
import EmployerNotifications from './pages/employer/EmployerNotifications';
import Subscription from './pages/employer/Subscription';
import HRManagement from './pages/employer/HRManagement';
import EmployerSettings from './pages/employer/EmployerSettings';
import Analytics from './pages/employer/Analytics';
import EmployerSupport from './pages/employer/EmployerSupport';
import EmployerWallet from './pages/employer/EmployerWallet';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import CandidatesManagement from './pages/admin/CandidatesManagement';
import EmployersManagement from './pages/admin/EmployersManagement';
import PackagesManagement from './pages/admin/PackagesManagement';
import Reports from './pages/admin/Reports';
import AdminSettings from './pages/admin/AdminSettings';
import DataAnalysis from './pages/admin/DataAnalysis';
import AdminWallet from './pages/admin/AdminWallet';
import PostsManagement from './pages/admin/PostsManagement';
import AdminSupport from './pages/admin/AdminSupport';
import AdminNotifications from './pages/admin/AdminNotifications';
import AdminProfile from './pages/admin/AdminProfile';

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
      <Route path="/download" element={<DownloadApp />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/register" element={<RegisterRoleSelection />} />
      <Route path="/register/candidate" element={<CandidateRegister />} />
      <Route path="/register/employer" element={<EmployerRegister />} />
      <Route path="/verify-otp" element={<OTPVerification />} />
      <Route path="/pending-approval" element={<PendingApproval />} />
      
      {/* Candidate Routes */}
      <Route path="/candidate" element={<Navigate to="/candidate/dashboard" replace />} />
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
      <Route path="/candidate/employer/:employerId" element={
        <ProtectedRoute allowedRoles={['candidate']}>
          <EmployerProfileView />
        </ProtectedRoute>
      } />
      <Route path="/candidate/support" element={
        <ProtectedRoute allowedRoles={['candidate']}>
          <Support />
        </ProtectedRoute>
      } />
      <Route path="/candidate/wallet" element={
        <ProtectedRoute allowedRoles={['candidate']}>
          <Wallet />
        </ProtectedRoute>
      } />
      <Route path="/candidate/availability" element={
        <ProtectedRoute allowedRoles={['candidate']}>
          <Availability />
        </ProtectedRoute>
      } />
      <Route path="/candidate/posts" element={
        <ProtectedRoute allowedRoles={['candidate']}>
          <CandidatePosts />
        </ProtectedRoute>
      } />
      <Route path="/candidate/change-password" element={
        <ProtectedRoute allowedRoles={['candidate']}>
          <ChangePassword />
        </ProtectedRoute>
      } />
      <Route path="/candidate/delete-account" element={
        <ProtectedRoute allowedRoles={['candidate']}>
          <DeleteAccount />
        </ProtectedRoute>
      } />
      <Route path="/candidate/kyc" element={
        <ProtectedRoute allowedRoles={['candidate']}>
          <CandidateKYC />
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
      <Route path="/employer/verification" element={
        <ProtectedRoute allowedRoles={['employer']}>
          <CompanyVerification />
        </ProtectedRoute>
      } />
      <Route path="/employer/jobs" element={
        <ProtectedRoute allowedRoles={['employer']}>
          <JobManagement />
        </ProtectedRoute>
      } />
      <Route path="/employer/standard-jobs" element={
        <ProtectedRoute allowedRoles={['employer']}>
          <Applications />
        </ProtectedRoute>
      } />
      <Route path="/employer/profile" element={
        <ProtectedRoute allowedRoles={['employer']}>
          <EmployerProfile />
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
      <Route path="/employer/quick-jobs" element={
        <ProtectedRoute allowedRoles={['employer']}>
          <HRManagement />
        </ProtectedRoute>
      } />
      <Route path="/employer/settings" element={
        <ProtectedRoute allowedRoles={['employer']}>
          <EmployerSettings />
        </ProtectedRoute>
      } />
      <Route path="/employer/analytics" element={
        <ProtectedRoute allowedRoles={['employer']}>
          <Analytics />
        </ProtectedRoute>
      } />
      <Route path="/employer/support" element={
        <ProtectedRoute allowedRoles={['employer']}>
          <EmployerSupport />
        </ProtectedRoute>
      } />
      <Route path="/employer/wallet" element={
        <ProtectedRoute allowedRoles={['employer']}>
          <EmployerWallet />
        </ProtectedRoute>
      } />
      
      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/candidates" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <CandidatesManagement />
        </ProtectedRoute>
      } />
      <Route path="/admin/employers" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <EmployersManagement />
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
      <Route path="/admin/analytics" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <DataAnalysis />
        </ProtectedRoute>
      } />
      <Route path="/admin/wallet" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminWallet />
        </ProtectedRoute>
      } />
      <Route path="/admin/posts" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <PostsManagement />
        </ProtectedRoute>
      } />
      <Route path="/admin/support" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminSupport />
        </ProtectedRoute>
      } />
      <Route path="/admin/notifications" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminNotifications />
        </ProtectedRoute>
      } />
      <Route path="/admin/profile" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminProfile />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <CustomThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <ThemedApp />
        </AuthProvider>
      </LanguageProvider>
    </CustomThemeProvider>
  );
}

function ThemedApp() {
  const { isDarkMode } = useTheme();
  
  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : theme}>
      <GlobalStyles />
      <Router basename="/OpPoReview/">
        <ScrollToTop />
        <AppRoutes />
      </Router>
    </ThemeProvider>
  );
}

export default App;
