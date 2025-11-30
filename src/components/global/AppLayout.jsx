import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

import Navbar from './Navbar';

export default function AppLayout() {
  const { user } = useAuth();

  return (
    <>
      <Navbar variant="client" user={user} />
      <main className="app-main">
        <Outlet />
      </main>
    </>
  );
}
