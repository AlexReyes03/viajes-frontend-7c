import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Avatar } from 'primereact/avatar';

import Logo from '../../assets/img/logo.png';

export default function Navbar({ variant = 'login', user = {} }) {
  const renderCenterLinks = () => {
    if (variant === 'client') {
      return (
        <div className="collapse navbar-collapse justify-content-center" id="navbarContent">
          <ul className="navbar-nav mb-2 mb-lg-0 gap-3 fw-medium">
            <li className="nav-item">
              <NavLink to="/home" className={({ isActive }) => `nav-link text-white ${isActive ? 'active-link' : ''}`}>
                Inicio
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/trips" className={({ isActive }) => `nav-link text-white ${isActive ? 'active-link' : ''}`}>
                Viajes
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/alerts" className={({ isActive }) => `nav-link text-white ${isActive ? 'active-link' : ''}`}>
                Alertas
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/profile" className={({ isActive }) => `nav-link text-white ${isActive ? 'active-link' : ''}`}>
                Perfil
              </NavLink>
            </li>
          </ul>
        </div>
      );
    }
    return <div className="flex-grow-1"></div>;
  };

  const renderRightContent = () => {
    switch (variant) {
      case 'login':
        return (
          <Link to="/register" className="d-flex align-items-center text-white text-decoration-none fw-medium">
            <i className="bi bi-person fs-5 me-2"></i>
            Registrarse
          </Link>
        );
      case 'register':
        return (
          <Link to="/login" className="d-flex align-items-center text-white text-decoration-none fw-medium">
            <i className="bi bi-person fs-5 me-2"></i>
            Iniciar sesión
          </Link>
        );
      case 'recover':
        return null;
      case 'client':
        return (
          <div className="d-flex align-items-center gap-2 text-white">
            <span className="fw-semibold d-none d-md-block">{user.name || 'Usuario'}</span>
            <Avatar image={user.avatar} icon={!user.avatar ? 'pi pi-user' : null} shape="circle" className="bg-warning text-white" style={{ width: '40px', height: '40px' }} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark velocity-navbar shadow-sm px-2">
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold text-white fs-4" to="/">
          <img src={Logo} alt="VeloCity Logo" width="40" height="40" className="d-inline-block align-text-top" />
          VeloCity
        </Link>

        {variant === 'client' && (
          <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
            <span className="navbar-toggler-icon"></span>
          </button>
        )}

        {renderCenterLinks()}

        <div className={`d-flex align-items-center ${variant === 'client' ? 'ms-lg-0 ms-auto' : ''}`}>{renderRightContent()}</div>
      </div>
    </nav>
  );
}
