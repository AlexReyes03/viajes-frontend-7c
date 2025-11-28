import React from 'react';
import { Outlet } from 'react-router-dom';

import Navbar from './Navbar';

export default function AppLayout() {
  // Usuario mock para pruebas visuales
  const mockUser = {
    name: 'Usuario Prueba',
    avatar: null
  };

  return (
    <>
      <Navbar variant="client" user={mockUser} />
      <main className="app-main">
        <Outlet />
      </main>
    </>
  );
}
