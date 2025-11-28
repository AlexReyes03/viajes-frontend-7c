import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRouter';
import PublicRoute from './PublicRouter';

import NotFound from '../components/global/NotFound';

import AuthLayout from '../components/global/AuthLayout';
import LoginForm from '../features/auth/views/LoginForm';
import RegisterForm from '../features/auth/views/RegisterForm';
import RecoverEmailForm from '../features/auth/views/RecoverEmailForm';
import RecoverOTPForm from '../features/auth/views/RecoverOTPForm';
import RecoverPasswordForm from '../features/auth/views/RecoverPasswordForm';

import AppLayout from '../components/global/AppLayout';

const HomePage = () => <h1>Home Page</h1>;

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
      <Route element={<PrivateRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
