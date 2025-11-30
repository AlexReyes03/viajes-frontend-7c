import React, { useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Avatar } from 'primereact/avatar';
import { Menu } from 'primereact/menu';

import Logo from '../../assets/img/logo.png';

export default function Navbar({ variant = 'login', user = {} }) {
  const menuRight = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Detect current route prefix to determine user role context
  const getCurrentRoot = () => {
    const path = location.pathname;
    if (path.startsWith('/d')) return '/d';
    if (path.startsWith('/a')) return '/a';
    return '/p';
  };

  const currentRoot = getCurrentRoot();
  const isAdmin = currentRoot === '/a';

  // Get navigation links based on current role context
  const getNavigationLinks = () => {
    if (isAdmin) {
      return [
        { label: 'Estadísticas', to: '/a/home' },
        { label: 'Usuarios', to: '/a/users' },
        { label: 'Tarifas', to: '/a/tariffs' },
        { label: 'Perfil', to: '/a/profile' },
      ];
    }

    // Default links for passenger and driver
    return [
      { label: 'Inicio', to: `${currentRoot}/home` },
      { label: 'Viajes', to: `${currentRoot}/trips` },
      { label: 'Alertas', to: `${currentRoot}/alerts` },
      { label: 'Perfil', to: `${currentRoot}/profile` },
    ];
  };

  // Menu items for user dropdown
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
            navigate('/login');
          },
        },
      ],
    },
  ];

  const renderCenterLinks = () => {
    if (variant === 'client') {
      const links = getNavigationLinks();

      return (
        <>
          <style>{`
            /* Estilos Base Mobile First */
            .velocity-navbar .nav-link {
              padding: 0.5rem 1rem !important;
              transition: all 0.2s;
              position: relative; /* Para el borde en desktop */
            }

            /* Mobile Only */
            @media (max-width: 991.98px) {
              #navbarContent .navbar-nav {
                background-color: rgba(0, 0, 0, 0.1);
                padding: 0.5rem;
                border-radius: 12px;
                margin-top: 0.5rem;
              }
              .velocity-navbar .nav-link:hover {
                background-color: rgba(255, 255, 255, 0.1);
                border-radius: 8px;
              }
              .velocity-navbar .nav-link.active-link {
                background-color: rgba(255, 255, 255, 0.2) !important;
                border-radius: 8px;
                font-weight: 700;
              }
              /* Sin borde en mobile */
              .velocity-navbar .nav-link.active-link::after {
                display: none;
              }
            }

            /* Desktop Only */
            @media (min-width: 992px) {
              .velocity-navbar .nav-link.active-link {
                font-weight: 700;
                background-color: transparent !important; /* Sin fondo en desktop */
              }
              
              /* Borde animado */
              .velocity-navbar .nav-link::after {
                content: '';
                position: absolute;
                left: 0;
                right: 0;
                bottom: 5px; /* Un poco arriba del borde real */
                height: 3px;
                background-color: #fff;
                transform: scaleX(0); /* Empieza invisible */
                transform-origin: left;
              }

              .velocity-navbar .nav-link.active-link::after {
                transform: scaleX(1); /* Se expande completo */
                transition: transform 0.3s ease-in; /* Solo anima al aparecer */
                height: 3px !important; /* Mantiene grosor consistente overriding global */
                bottom: 5px !important; /* Mantiene posición consistente overriding global */
              }
            }
          `}</style>
          <div className="collapse navbar-collapse justify-content-center order-3 order-lg-2" id="navbarContent">
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
    <nav className="navbar navbar-expand-lg navbar-dark velocity-navbar shadow-sm px-2">
      <div className="container-fluid">
        {variant === 'client' && (
          <button className="navbar-toggler border-0 me-2" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
            <span className="navbar-toggler-icon"></span>
          </button>
        )}

        {/* Logo and app name */}
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold text-white fs-4 me-auto me-lg-0" to="/">
          <img src={Logo} alt="VeloCity Logo" width="40" height="40" className="d-inline-block align-text-top" />
          VeloCity
        </Link>

        {renderCenterLinks()}

        <div className={`d-flex align-items-center order-2 order-lg-3 ${variant === 'client' ? 'ms-0 ms-lg-auto' : 'ms-auto'}`}>{renderRightContent()}</div>
      </div>
    </nav>
  );
}
