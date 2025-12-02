import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRouter from './PrivateRouter';
import PublicRoute from './PublicRouter';
import { useAuth } from '../contexts/AuthContext';

import NotFound from '../components/global/NotFound';
import UserProfile from '../components/global/UserProfile';
import Notifications from '../components/global/Notifications';
import Messages from '../components/global/Messages';

import AuthLayout from '../components/global/AuthLayout';
import LoginForm from '../features/auth/views/LoginForm';
import RegisterForm from '../features/auth/views/RegisterForm';
import RecoverEmailForm from '../features/auth/views/RecoverEmailForm';
import RecoverOTPForm from '../features/auth/views/RecoverOTPForm';
import RecoverPasswordForm from '../features/auth/views/RecoverPasswordForm';

import AppLayout from '../components/global/AppLayout';
import PassengerLandingPage from '../features/passenger/views/LandingPage';
import PassengerTripHistory from '../features/passenger/views/TripHistory';
import DriverDashboard from '../features/driver/views/Dashboard';
import DriverTripHistory from '../features/driver/views/TripHistory';

// Admin views
import AdminStatistics from '../features/admin/views/Statistics';
import AdminUsers from '../features/admin/views/Users';

const RoleRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  
  const roles = user.roles ? user.roles.split(',') : [];
  
  if (roles.includes('ROLE_ADMIN')) return <Navigate to="/a/home" />;
  if (roles.includes('ROLE_CONDUCTOR')) return <Navigate to="/d/home" />;
  return <Navigate to="/p/home" />;
};

const AppRouter = () => {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/recover" element={<RecoverEmailForm />} />
          <Route path="/recover-otp" element={<RecoverOTPForm />} />
          <Route path="/recover-password" element={<RecoverPasswordForm />} />
        </Route>
      </Route>

      <Route element={<PrivateRouter />}>
        <Route path="/" element={<RoleRedirect />} />
      </Route>

      {/* Passenger Routes */}
      <Route element={<PrivateRouter allowedRoles={['ROLE_CLIENTE']} />}>
        <Route element={<AppLayout />}>
          <Route path="/p/home" element={<PassengerLandingPage />} />
          <Route path="/p/profile" element={<UserProfile />} />
          <Route path="/p/trips" element={<PassengerTripHistory />} />
          <Route path="/p/alerts" element={<Notifications />} />
          <Route path="/p/messages" element={<Messages />} />
        </Route>
      </Route>

      {/* Driver Routes */}
      <Route element={<PrivateRouter allowedRoles={['ROLE_CONDUCTOR']} />}>
        <Route element={<AppLayout />}>
          <Route path="/d/home" element={<DriverDashboard />} />
          <Route path="/d/trips" element={<DriverTripHistory />} />
          <Route path="/d/profile" element={<UserProfile />} />
          <Route path="/d/alerts" element={<Notifications />} />
          <Route path="/d/messages" element={<Messages />} />
        </Route>
      </Route>

      {/* Admin Routes */}
      <Route element={<PrivateRouter allowedRoles={['ROLE_ADMIN']} />}>
        <Route element={<AppLayout />}>
          <Route path="/a/home" element={<AdminStatistics />} />
          <Route path="/a/users" element={<AdminUsers />} />
          <Route path="/a/profile" element={<UserProfile />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
