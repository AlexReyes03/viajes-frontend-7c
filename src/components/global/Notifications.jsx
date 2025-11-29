import React, { useState, useRef } from 'react';
import { Menu } from 'primereact/menu';
import Icon from '@mdi/react';
import {
  mdiInboxFullOutline, // Icono para Todos
  mdiBellRingOutline, // Icono para No leídos
  mdiBellOutline, // Icono para Leídos
  mdiTicketPercentOutline, // Icono para Ofertas
  mdiAlertCircleOutline, // Icono de Alerta en la tarjeta
  mdiDotsHorizontal, // Icono de menú (3 puntos)
} from '@mdi/js';

export default function Notifications() {
  const [activeTab, setActiveTab] = useState('todos');
  const menuRef = useRef(null);
  const selectedNotification = useRef(null); // Para saber a qué item le dimos click

  // Datos simulados (Mock Data) basados en tu imagen
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
      type: 'offer', // Tipo especial para cambiar el estilo
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
            // Aquí lógica real
          },
        },
        {
          label: 'Eliminar',
          icon: 'pi pi-trash',
          className: 'text-danger',
          command: () => {
            console.log('Eliminar:', selectedNotification.current);
            // Aquí lógica real
          },
        },
      ],
    },
  ];

  // Función helper para abrir el menú y setear el item actual
  const handleMenuClick = (event, item) => {
    selectedNotification.current = item;
    menuRef.current.toggle(event);
  };

  // Componente para los botones del Tab
  const TabButton = ({ id, label, icon }) => {
    const isActive = activeTab === id;
    return (
      <div
        className={`d-flex align-items-center gap-2 pb-3 cursor-pointer position-relative px-4`}
        style={{
          cursor: 'pointer',
          color: isActive ? 'var(--color-blue-tint-1)' : '#000',
          fontWeight: isActive ? '700' : '400',
          borderBottom: isActive ? '3px solid var(--color-blue-tint-1)' : '3px solid transparent',
          transition: 'all 0.2s ease',
        }}
        onClick={() => setActiveTab(id)}
      >
        <Icon path={icon} size={1} />
        <span>{label}</span>
      </div>
    );
  };

  // Componente para la Tarjeta de Notificación
  const NotificationCard = ({ item }) => {
    const isOffer = item.type === 'offer';

    return (
      <div
        className="card mb-3 shadow-sm"
        style={{
          borderRadius: '12px',
          border: '1px solid #dee2e6',
          // Color de fondo condicional: Lila claro si es oferta, blanco si no
          backgroundColor: isOffer ? '#EBE5F0' : '#fff',
        }}
      >
        <div className="card-body p-4">
          <div className="d-flex align-items-start gap-3">
            {/* ICONO IZQUIERDO */}
            <div className="flex-shrink-0 mt-1">
              <Icon path={isOffer ? mdiTicketPercentOutline : mdiAlertCircleOutline} size={1.5} color="#000" />
            </div>

            {/* CONTENIDO TEXTO */}
            <div className="flex-grow-1">
              <div className="d-flex align-items-center gap-2 mb-1">
                <span className="fw-bold text-dark fs-6">{item.title}</span>
                <span className="text-secondary small">• {item.date}</span>
              </div>
              <p className="mb-0 text-dark small">{item.description}</p>
            </div>

            {/* MENÚ (3 PUNTOS) */}
            <div className="flex-shrink-0">
              <button className="btn btn-link text-dark p-0 border-0" onClick={(e) => handleMenuClick(e, item)} aria-haspopup aria-controls="notification_menu">
                <Icon path={mdiDotsHorizontal} size={1} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container py-4">
      {/* Menú Popup Global (se recicla para todos los items) */}
      <Menu model={menuItems} popup ref={menuRef} id="notification_menu" popupAlignment="right" />

      <div className="row justify-content-center">
        <div className="col-12 col-xl-10">
          <div className="card border-0 shadow-sm" style={{ borderRadius: '12px', minHeight: '80vh' }}>
            <div className="card-body p-0">
              {/* --- HEADER TABS --- */}
              <div className="d-flex justify-content-around align-items-center pt-4 border-bottom mb-4 px-3">
                <TabButton id="todos" label="Todos" icon={mdiInboxFullOutline} />
                <TabButton id="no-leidos" label="No leídos" icon={mdiBellRingOutline} />
                <TabButton id="leidos" label="Leídos" icon={mdiBellOutline} />
                <TabButton id="ofertas" label="Ofertas" icon={mdiTicketPercentOutline} />
              </div>

              {/* --- LISTA DE NOTIFICACIONES --- */}
              <div className="px-4 pb-4">
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
