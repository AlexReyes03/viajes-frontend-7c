import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRouter';
import PublicRoute from './PublicRouter';

import NotFound from '../components/global/NotFound';
import UserProfile from '../components/global/UserProfile';
import Notifications from '../components/global/Notifications';

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
import AdminTariffs from '../features/admin/views/Tariffs';

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

        {/* Public routes for development without authentication */}
        <Route element={<AppLayout />}>
          {/* Passenger routes */}
          <Route path="/p/home" element={<PassengerLandingPage />} />
          <Route path="/p/profile" element={<UserProfile />} />
          <Route path="/p/trips" element={<PassengerTripHistory />} />
          <Route path="/p/alerts" element={<Notifications />} />

          {/* Driver routes */}
          <Route path="/d/home" element={<DriverDashboard />} />
          <Route path="/d/trips" element={<DriverTripHistory />} />
          <Route path="/d/profile" element={<UserProfile />} />
          <Route path="/d/alerts" element={<Notifications />} />

          {/* Admin routes */}
          <Route path="/a/stats" element={<AdminStatistics />} />
          <Route path="/a/users" element={<AdminUsers />} />
          <Route path="/a/tariffs" element={<AdminTariffs />} />
        </Route>
      </Route>

      <Route element={<PrivateRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<PassengerLandingPage />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
