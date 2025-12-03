import React, { useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Avatar } from 'primereact/avatar';
import { Menu } from 'primereact/menu';
import { useAuth } from '../../contexts/AuthContext';

import Logo from '../../assets/img/Logo.png';

export default function Navbar({ variant = 'login', user = {} }) {
  const menuRight = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const getCurrentRoot = () => {
    const path = location.pathname;
    if (path.startsWith('/d')) return '/d';
    if (path.startsWith('/a')) return '/a';
    return '/p';
  };

  const currentRoot = getCurrentRoot();
  const isAdmin = currentRoot === '/a';

  const getNavigationLinks = () => {
    if (isAdmin) {
      return [
        { label: 'Estadísticas', to: '/a/home', icon: 'pi pi-chart-bar' },
        { label: 'Usuarios', to: '/a/users', icon: 'pi pi-users' },
        { label: 'Perfil', to: '/a/profile', icon: 'pi pi-user' },
      ];
    }

    // Default links for passenger and driver
    return [
      { label: 'Inicio', to: `${currentRoot}/home`, icon: 'pi pi-home' },
      { label: 'Viajes', to: `${currentRoot}/trips`, icon: 'pi pi-car' },
      { label: 'Alertas', to: `${currentRoot}/alerts`, icon: 'pi pi-bell' },
      { label: 'Perfil', to: `${currentRoot}/profile`, icon: 'pi pi-user' },
    ];
  };

  const userMenuItems = [
    {
      label: 'Opciones',
      items: [
        {
          label: 'Ir a perfil',
          icon: 'pi pi-user',
          command: () => {
            navigate(`${currentRoot}/profile`);
          },
        },
        {
          label: 'Cerrar sesión',
          icon: 'pi pi-power-off',
          command: () => {
            logout();
            navigate('/login');
          },
        },
      ],
    },
  ];

  const renderDesktopLinks = () => {
    if (variant !== 'client') return <div className="flex-grow-1 d-none d-lg-block"></div>;
    const links = getNavigationLinks();

    return (
      <>
        <style>{`
          @media (min-width: 992px) {
            .velocity-navbar .nav-link {
              padding: 0.5rem 1rem !important;
              transition: all 0.2s;
              position: relative;
            }
            .velocity-navbar .nav-link.active-link {
              font-weight: 700;
              background-color: transparent !important;
            }
            .velocity-navbar .nav-link::after {
              content: '';
              position: absolute;
              left: 0;
              right: 0;
              bottom: 5px;
              height: 3px;
              background-color: #fff;
              transform: scaleX(0);
              transition: transform 0.3s ease-in;
              transform-origin: left;
            }
            .velocity-navbar .nav-link.active-link::after {
              transform: scaleX(1);
              transition: transform 0.3s ease-in;
              height: 3px !important;
              bottom: 5px !important;
            }
          }
        `}</style>
        <div className="collapse navbar-collapse justify-content-center order-2" id="navbarContent">
          <ul className="navbar-nav mb-2 mb-lg-0 gap-1 fw-medium">
            {links.map((link) => (
              <li className="nav-item" key={link.to}>
                <NavLink to={link.to} className={({ isActive }) => `nav-link text-white ${isActive ? 'active-link' : ''}`}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </>
    );
  };

  const renderMobileTabs = () => {
    if (variant !== 'client') return null;
    const links = getNavigationLinks();

    const mobileContainerStyle = {
      marginLeft: '-1rem',
      marginRight: '-1rem',
      marginBottom: '-0.5rem',
      width: 'calc(100% + 2rem)',
    };

    return (
      <div className="d-flex d-lg-none mt-2" style={mobileContainerStyle}>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className="text-white d-flex align-items-center justify-content-center flex-grow-1"
            style={({ isActive }) => ({
              textDecoration: 'none',
              padding: '0.8rem 0',
              borderBottom: isActive ? '4px solid #ffffff' : '4px solid transparent',
              transition: 'border-color 0.2s',
              flexBasis: 0,
              opacity: isActive ? 1 : 0.7,
            })}
          >
            <i className={`${link.icon} fs-4`}></i>
          </NavLink>
        ))}
      </div>
    );
  };

  const renderRightContent = () => {
    switch (variant) {
      case 'login':
        return (
          <Link to="/register" className="d-flex align-items-center text-white text-decoration-none fw-medium">
            Registrarse
            <i className="pi pi-user-plus fs-5 ms-2"></i>
          </Link>
        );
      case 'register':
        return (
          <Link to="/login" className="d-flex align-items-center text-white text-decoration-none fw-medium">
            Iniciar sesión
            <i className="pi pi-sign-in fs-5 ms-2"></i>
          </Link>
        );
      case 'recover':
        return null;
      case 'client':
        return (
          <>
            <Menu model={userMenuItems} popup ref={menuRight} id="popup_menu_right" popupAlignment="right" />
            <div className="d-flex align-items-center gap-2 text-white hoverable p-1 rounded transition-all" onClick={(event) => menuRight.current.toggle(event)} aria-controls="popup_menu_right" aria-haspopup>
              <span className="fw-semibold d-none d-md-block">{user.name || (isAdmin ? 'Administrador' : 'Usuario')}</span>
              <Avatar image={user.avatar} icon={!user.avatar ? 'pi pi-user' : null} shape="circle" className="bg-warning text-white" style={{ width: '40px', height: '40px' }} />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark velocity-navbar shadow-sm px-3 py-2">
      <div className="container-fluid d-flex flex-wrap align-items-center justify-content-between px-0">
        {/* Row 1: Logo & User (Mobile & Desktop) */}
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold text-white fs-4 me-0" to="/">
          <img src={Logo} alt="VeloCity Logo" width="40" height="40" className="d-inline-block align-text-top" />
          VeloCity
        </Link>

        <div className="d-flex align-items-center order-lg-3 ms-auto">{renderRightContent()}</div>

        {/* Row 2 (Mobile) / Center (Desktop): Navigation */}
        <div className="w-100 d-lg-none order-3">{renderMobileTabs()}</div>

        {renderDesktopLinks()}
      </div>
    </nav>
  );
}
