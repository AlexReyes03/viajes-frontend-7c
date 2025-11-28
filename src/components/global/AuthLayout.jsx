import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Fondo from '../../assets/img/fondo-auth.png';
import Navbar from './Navbar';

export default function AuthLayout() {
  const location = useLocation();

  const getNavbarVariant = () => {
    const path = location.pathname;

    if (path === '/register') return 'register';
    if (path.startsWith('/recover')) return 'recovery';

    return 'login';
  };

  return (
    <>
      <Navbar variant={getNavbarVariant()} />
      <main
        className="app-main"
        style={{
          backgroundImage: `url(${Fondo})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="container-fluid">
          <Outlet />
        </div>
      </main>
    </>
  );
}
