import React, { useState, useRef } from 'react';
import { Menu } from 'primereact/menu';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import Icon from '@mdi/react';
import {
  mdiInboxFullOutline,
  mdiBellRingOutline,
  mdiBellOutline,
  mdiTicketPercentOutline,
  mdiAlertCircleOutline,
  mdiDotsHorizontal,
  mdiClockOutline,
  mdiCheckCircleOutline,
  mdiAlertOutline,
  mdiCloseCircleOutline,
  mdiInformationOutline,
  mdiClock,
  mdiClockAlert
} from '@mdi/js';
import { useNotifications } from '../../hooks/useNotifications';

export default function Notifications() {
  const [activeTab, setActiveTab] = useState('todos');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailNotification, setDetailNotification] = useState(null);
  const menuRef = useRef(null);
  const selectedNotification = useRef(null);

  // Usar hook de notificaciones
  const {
    notifications: allNotifications,
    unreadNotifications,
    readNotifications,
    loading,
    error,
    markAsRead,
    deleteNotification
  } = useNotifications();

  // Mapear tipos de notificación del backend a iconos
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'OK':
        return { icon: mdiCheckCircleOutline, color: '#4CAF50' };
      case 'WARN':
        return { icon: mdiAlertOutline, color: '#FF9800' };
      case 'ERROR':
        return { icon: mdiCloseCircleOutline, color: '#F44336' };
      case 'INFO':
      default:
        return { icon: mdiInformationOutline, color: '#0084c4' };
    }
  };

  // Filtrar notificaciones según el tab activo
  const getFilteredNotifications = () => {
    switch (activeTab) {
      case 'no-leidos':
        return unreadNotifications;
      case 'leidos':
        return readNotifications;
      case 'ofertas':
        return allNotifications.filter(n => n.type === 'OFFER');
      case 'todos':
      default:
        return allNotifications;
    }
  };

  const notifications = getFilteredNotifications();

  const menuItems = [
    {
      label: 'Opciones',
      items: [
        {
          label: 'Marcar como leído',
          icon: 'pi pi-check',
          command: async () => {
            try {
              await markAsRead(selectedNotification.current.id);
            } catch (err) {
              console.error('Error al marcar como leída:', err);
            }
          },
        },
        {
          label: 'Eliminar',
          icon: 'pi pi-trash',
          className: 'text-danger',
          command: async () => {
            try {
              await deleteNotification(selectedNotification.current.id);
            } catch (err) {
              console.error('Error al eliminar:', err);
            }
          },
        },
      ],
    },
  ];

  const handleMenuClick = (event, item) => {
    event.stopPropagation();
    selectedNotification.current = item;
    menuRef.current.toggle(event);
  };

  const openDetailModal = async (item) => {
    setDetailNotification(item);
    setShowDetailModal(true);

    // Marcar como leída al abrir
    if (!item.read) {
      try {
        await markAsRead(item.id);
      } catch (err) {
        console.error('Error al marcar como leída:', err);
      }
    }
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setDetailNotification(null);
  };

  const TabButton = ({ id, label, icon }) => {
    const isActive = activeTab === id;
    return (
      <div
        className="d-flex align-items-center justify-content-center gap-2 py-3 flex-grow-1"
        style={{
          cursor: 'pointer',
          color: isActive ? 'var(--color-blue-tint-1)' : '#6c757d',
          fontWeight: isActive ? '700' : '500',
          borderBottom: isActive ? '3px solid var(--color-blue-tint-1)' : '3px solid transparent',
          transition: 'all 0.2s ease',
          userSelect: 'none',
          flexBasis: 0,
          minWidth: 0,
        }}
        onClick={() => setActiveTab(id)}
      >
        <Icon path={icon} size={1} className="flex-shrink-0" />
        <span className="text-truncate d-none d-md-block">{label}</span>
      </div>
    );
  };

  const NotificationCard = ({ item }) => {
    const iconConfig = getNotificationIcon(item.type);

    return (
      <div
        className={`card mb-3 shadow-sm hoverable cursor-pointer ${!item.read ? 'border-primary' : ''}`}
        style={{
          borderRadius: '12px',
          border: !item.read ? '2px solid #0084c4' : '1px solid #dee2e6',
          backgroundColor: !item.read ? '#F0F8FF' : '#fff',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          cursor: 'pointer',
        }}
        onClick={() => openDetailModal(item)}
      >
        <div className="card-body p-3 p-md-4">
          <div className="d-flex align-items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <Icon path={iconConfig.icon} size={1.5} color={iconConfig.color} />
            </div>

            <div className="flex-grow-1" style={{ minWidth: 0 }}>
              <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                <span className="fw-bold text-dark fs-6 text-truncate" style={{ maxWidth: '100%' }}>
                  {item.title}
                </span>
                {!item.read && (
                  <span className="badge bg-primary">Nuevo</span>
                )}
              </div>
              <p className="text-secondary small mb-1 d-flex align-items-center gap-1">
                <Icon path={mdiClockOutline} size={0.6} />
                {item.createdAt ? new Date(item.createdAt).toLocaleString('es-MX') : 'Sin fecha'}
              </p>
              <p
                className="mb-0 text-dark small text-truncate-2-lines"
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: '2',
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {item.body}
              </p>
            </div>

            <div className="flex-shrink-0">
              <button className="btn btn-link text-secondary p-1 border-0 rounded-circle hover-bg-light" onClick={(e) => handleMenuClick(e, item)} aria-haspopup aria-controls="notification_menu">
                <Icon path={mdiDotsHorizontal} size={1} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Mostrar loading
  if (loading) {
    return (
      <div className="container py-3">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <div className="container py-3">
        <div className="alert alert-danger" role="alert">
          Error al cargar notificaciones: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-3">
      <Menu model={menuItems} popup ref={menuRef} id="notification_menu" popupAlignment="right" />

      {/* Modal de Detalles */}
      <Dialog header={detailNotification?.title || 'Notificación'} visible={showDetailModal} onHide={closeDetailModal} style={{ width: '90vw', maxWidth: '500px' }} draggable={false} resizable={false} className="border-0 shadow" headerClassName="border-0 pb-0 fw-bold">
        {detailNotification && (
          <div className="pt-3">
            <div className="d-flex align-items-center gap-2 mb-3 text-muted small">
              <Icon path={mdiClockOutline} size={0.8} />
              <span>{detailNotification.createdAt ? new Date(detailNotification.createdAt).toLocaleString('es-MX') : 'Sin fecha'}</span>
              {detailNotification.type === 'OFFER' && <span className="badge bg-purple-tint-1 text-dark ms-auto">Oferta</span>}
            </div>

            <div className="p-3 bg-light rounded-3 mb-4">
              <p className="mb-0" style={{ lineHeight: '1.6' }}>
                {detailNotification.body}
              </p>
            </div>

            <div className="d-flex justify-content-end">
              <Button label="Cerrar" className="p-button-outlined fw-bold" style={{ color: 'var(--color-secondary)' }} onClick={closeDetailModal} />
            </div>
          </div>
        )}
      </Dialog>

      <div className="row justify-content-center">
        <div className="col-12">
          <div className="card border-0 shadow-sm" style={{ borderRadius: '12px', minHeight: '40vh' }}>
            <div className="card-body p-0">
              <div className="d-flex align-items-center border-bottom mb-4 w-100">
                <TabButton id="todos" label="Todos" icon={mdiInboxFullOutline} />
                <TabButton id="no-leidos" label="No leídos" icon={mdiBellRingOutline} />
                <TabButton id="leidos" label="Leídos" icon={mdiBellOutline} />
                <TabButton id="ofertas" label="Ofertas" icon={mdiTicketPercentOutline} />
              </div>

              <div className="px-3 px-md-4 pb-4">
                {notifications.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <Icon path={mdiInboxFullOutline} size={3} className="mb-3" />
                    <p>No hay notificaciones</p>
                  </div>
                ) : (
                  notifications.map((note) => (
                    <NotificationCard key={note.id} item={note} />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
