import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiAccountQuestion, mdiWallet, mdiBell, mdiFlash, mdiHistory, mdiMessageText, mdiHomeOutline, mdiStar } from '@mdi/js';
import { Avatar } from 'primereact/avatar';

import TripStatusCard from '../components/TripStatusCard';
import TripStatusMobile from '../components/TripStatusMobile';
import MapView from '../../../components/global/MapView';

// --- Componentes Auxiliares (Optimizados fuera del render principal) ---

const ToolButton = ({ icon, label }) => (
  <div className="col-4 mb-2">
    <button type="button" className="d-flex flex-column align-items-center justify-content-start p-0 border-0 shadow-none w-100 h-100 hoverable" style={{ background: 'transparent' }}>
      <div
        className="d-flex align-items-center justify-content-center mb-1"
        style={{
          backgroundColor: '#E7E0EB',
          width: '50px',
          height: '50px',
          borderRadius: '12px',
          color: '#000',
        }}
      >
        <Icon path={icon} size={1} />
      </div>
      <span className="small fw-semibold text-dark text-center text-truncate w-100" style={{ textTransform: 'none' }}>
        {label}
      </span>
    </button>
  </div>
);

const ActivityItem = ({ icon, address, rating }) => (
  <div className="d-flex align-items-center justify-content-between py-2 bg-light hoverable px-3 rounded-5 transition-all mb-2">
    <div className="d-flex align-items-center gap-3 overflow-hidden">
      <div className="rounded-circle border d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '35px', height: '35px' }}>
        <Icon path={icon} size={0.8} className="text-dark" />
      </div>
      <div className="d-flex flex-column overflow-hidden">
        <span className="fw-semibold small text-truncate w-100 d-block">{address}</span>
      </div>
    </div>
    <div className="d-flex align-items-center gap-1 flex-shrink-0 ms-2">
      <Icon path={mdiStar} size={0.6} className="text-dark" />
      <span className="small fw-bold">{rating}</span>
    </div>
  </div>
);

export default function LandingPage() {
  const [showTripCard, setShowTripCard] = useState(true);
  const location = useLocation(); // Obtener estado de navegación

  // Ubicación simulada del pasajero
  const passengerLocation = [18.8568, -98.7993];

  return (
    <div className="w-100 container pb-3">
      {/* --- SECCIÓN DEL MAPA Y SOLICITUD --- */}
      <div className="row py-3 position-relative">
        {/* VISTA MOBILE: Componente estático arriba del mapa */}
        <div className="col-12 d-lg-none">{showTripCard && <TripStatusMobile initialData={location.state} onHide={() => setShowTripCard(false)} />}</div>

        {/* VISTA DESKTOP: Componente flotante */}
        {showTripCard && (
          <div className="position-absolute end-0 top-0 pe-3 pt-4 d-none d-lg-block" style={{ zIndex: 1010, width: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <TripStatusCard onHide={() => setShowTripCard(false)} initialData={location.state} />
          </div>
        )}

        <div className="col-12">
          <div className="card shadow-sm overflow-hidden">
            <div className="map-container position-relative landing-map-height" onClick={() => setShowTripCard(true)} style={{ cursor: 'pointer' }}>
              <MapView
                center={passengerLocation}
                zoom={13}
                height="100%"
                markers={[
                  {
                    position: passengerLocation,
                    popup: 'Tu ubicación actual',
                    color: '#0084c4', // Azul para el pasajero
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </div>

      {/* --- SECCIÓN INFERIOR (3 COLUMNAS) --- */}
      <div className="row g-3">
        {/* TARJETA 1: Herramientas */}
        <div className="col-12 col-lg-4">
          <div className="card shadow-sm h-100">
            <div className="card-body p-3">
              <h4 className="fw-bold mb-3">Herramientas</h4>
              <div className="row g-2">
                <ToolButton icon={mdiAccountQuestion} label="Ayuda" />
                <ToolButton icon={mdiWallet} label="Billetera" />
                <ToolButton icon={mdiBell} label="Notificaciones" />
                <ToolButton icon={mdiFlash} label="App Plus" />
                <ToolButton icon={mdiHistory} label="Mis viajes" />
                <ToolButton icon={mdiMessageText} label="Mensajes" />
              </div>
            </div>
          </div>
        </div>

        {/* TARJETA 2: Actividad Reciente */}
        <div className="col-12 col-lg-4">
          <div className="card shadow-sm h-100">
            <div className="card-body p-3">
              <h4 className="fw-bold mb-3">Actividad reciente</h4>

              <div className="d-flex flex-column">
                <ActivityItem icon={mdiHomeOutline} address="Casa en Privada Valle de San..." rating="5.0" />
                <ActivityItem icon={mdiHistory} address="Tractor Verde, 53, Colonia Azt..." rating="4.5" />
                <ActivityItem icon={mdiHistory} address="Av. Universidad Tecnológica, Emiliano Zapata" rating="4.5" />
              </div>
            </div>
          </div>
        </div>

        {/* TARJETA 3: Mi Calificación */}
        <div className="col-12 col-lg-4">
          <div className="card shadow-sm h-100">
            <div className="card-body p-3 d-flex flex-column align-items-center justify-content-center text-center">
              <h4 className="fw-bold w-100 text-start mb-3">Mi calificación</h4>

              <div className="d-flex align-items-center gap-2 mb-2">
                <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/xuxuefeng.png" size="large" shape="circle" className="p-overlay-badge" style={{ width: '50px', height: '50px' }} />
                <span className="fs-4 fw-normal">Alejandro Reyes</span>
              </div>

              <div className="d-flex align-items-center gap-2 mb-2">
                <Icon path={mdiStar} size={2.5} style={{ color: 'var(--color-teal-tint-1)' }} />
                <span className="fw-bold" style={{ fontSize: '2.5rem', color: 'var(--color-teal-tint-1)' }}>
                  4.5
                </span>
              </div>

              <a href="#" className="text-muted text-decoration-none small mt-auto">
                Conoce el por qué de tu calificación
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
