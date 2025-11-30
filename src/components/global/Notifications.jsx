import React, { useState, useRef } from 'react';
import { Menu } from 'primereact/menu';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import Icon from '@mdi/react';
import { mdiInboxFullOutline, mdiBellRingOutline, mdiBellOutline, mdiTicketPercentOutline, mdiAlertCircleOutline, mdiDotsHorizontal, mdiClockOutline } from '@mdi/js';

export default function Notifications() {
  const [activeTab, setActiveTab] = useState('todos');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailNotification, setDetailNotification] = useState(null);
  const menuRef = useRef(null);
  const selectedNotification = useRef(null);

  const notifications = [
    {
      id: 1,
      type: 'info',
      title: 'Cambio en la Política de Cancelación',
      date: '16/11/2025',
      description: 'Hemos actualizado los términos para las cancelaciones a partir de hoy. Revisa el resumen de cambios.',
      read: false,
    },
    {
      id: 2,
      type: 'info',
      title: 'Nuevo Centro de Ayuda',
      date: '15/11/2025',
      description: 'Ahora es más fácil contactar con soporte. Explora nuestra sección de preguntas frecuentes y chat en vivo.',
      read: true,
    },
    {
      id: 3,
      type: 'info',
      title: '¡Viaje Finalizado!',
      date: '13/11/2025',
      description: 'Gracias por viajar con nosotros. Puedes consultar la información del viaje en la sección de Viajes.',
      read: true,
    },
    {
      id: 4,
      type: 'info',
      title: 'Tu Conductor está Cerca',
      date: '13/11/2025',
      description: 'El conductor. Llegará a tu punto de recogida en menos de 2 minutos. Prepárate.',
      read: false,
    },
    {
      id: 5,
      type: 'offer',
      title: '¡Oferta de nuevo usuario!',
      date: '16/05/2025',
      description: 'Obtén un cupón para tu primer viaje.',
      read: false,
    },
  ];

  const menuItems = [
    {
      label: 'Opciones',
      items: [
        {
          label: 'Marcar como leído',
          icon: 'pi pi-check',
          command: () => {
            console.log('Marcar como leído:', selectedNotification.current);
          },
        },
        {
          label: 'Eliminar',
          icon: 'pi pi-trash',
          className: 'text-danger',
          command: () => {
            console.log('Eliminar:', selectedNotification.current);
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

  const openDetailModal = (item) => {
    setDetailNotification(item);
    setShowDetailModal(true);
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
        <span className="text-truncate">{label}</span>
      </div>
    );
  };

  const NotificationCard = ({ item }) => {
    const isOffer = item.type === 'offer';

    return (
      <div
        className="card mb-3 shadow-sm hoverable cursor-pointer"
        style={{
          borderRadius: '12px',
          border: '1px solid #dee2e6',
          backgroundColor: isOffer ? '#F8F5FA' : '#fff',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          cursor: 'pointer',
        }}
        onClick={() => openDetailModal(item)}
      >
        <div className="card-body p-3 p-md-4">
          <div className="d-flex align-items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <Icon path={isOffer ? mdiTicketPercentOutline : mdiAlertCircleOutline} size={1.5} color={isOffer ? '#9C27B0' : '#0084c4'} />
            </div>

            <div className="flex-grow-1" style={{ minWidth: 0 }}>
              <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                <span className="fw-bold text-dark fs-6 text-truncate" style={{ maxWidth: '100%' }}>
                  {item.title}
                </span>
              </div>
              <p className="text-secondary small mb-1 d-flex align-items-center gap-1">
                <Icon path={mdiClockOutline} size={0.6} /> {item.date}
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
                {item.description}
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

  return (
    <div className="container py-3">
      <Menu model={menuItems} popup ref={menuRef} id="notification_menu" popupAlignment="right" />

      {/* Modal de Detalles */}
      <Dialog header={detailNotification?.title || 'Notificación'} visible={showDetailModal} onHide={closeDetailModal} style={{ width: '90vw', maxWidth: '500px' }} draggable={false} resizable={false} className="border-0 shadow" headerClassName="border-0 pb-0 fw-bold">
        {detailNotification && (
          <div className="pt-3">
            <div className="d-flex align-items-center gap-2 mb-3 text-muted small">
              <Icon path={mdiClockOutline} size={0.8} />
              <span>{detailNotification.date}</span>
              {detailNotification.type === 'offer' && <span className="badge bg-purple-tint-1 text-dark ms-auto">Oferta</span>}
            </div>

            <div className="p-3 bg-light rounded-3 mb-4">
              <p className="mb-0" style={{ lineHeight: '1.6' }}>
                {detailNotification.description}
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
              {/* Tabs con ancho completo y distribuido */}
              <div className="d-flex align-items-center border-bottom mb-4 w-100">
                <TabButton id="todos" label="Todos" icon={mdiInboxFullOutline} />
                <TabButton id="no-leidos" label="No leídos" icon={mdiBellRingOutline} />
                <TabButton id="leidos" label="Leídos" icon={mdiBellOutline} />
                <TabButton id="ofertas" label="Ofertas" icon={mdiTicketPercentOutline} />
              </div>

              <div className="px-3 px-md-4 pb-4">
                {notifications.map((note) => (
                  <NotificationCard key={note.id} item={note} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
