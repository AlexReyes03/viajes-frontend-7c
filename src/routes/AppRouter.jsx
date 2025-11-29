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
import TripHistory from '../features/passenger/views/TripHistory';

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

        {/* Rutas públicas temporales, para desarrollo sin autenticación */}
        <Route element={<AppLayout />}>
          <Route path="/p/home" element={<PassengerLandingPage />} />
          <Route path="/p/profile" element={<UserProfile />} />
          <Route path="/p/trips" element={<TripHistory />} />
          <Route path="/p/alerts" element={<Notifications />} />
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
