import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import Icon from '@mdi/react';
import { mdiAccountQuestion, mdiWallet, mdiBell, mdiFlash, mdiHistory, mdiMessageText, mdiAccount, mdiStar } from '@mdi/js';
import { Avatar } from 'primereact/avatar';

import TripStatusCard from '../components/TripStatusCard';
import TripStatusMobile from '../components/TripStatusMobile';
import MapView from '../../../components/global/MapView';

// --- Componentes Auxiliares (Optimizados fuera del render principal) ---

const ToolButton = ({ icon, label, onClick }) => (
  <div className="col-4 mb-2">
    <button type="button" className="d-flex flex-column align-items-center justify-content-start p-0 border-0 shadow-none w-100 h-100 hoverable" style={{ background: 'transparent' }} onClick={onClick}>
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

const RatingItem = ({ passengerName, rating }) => (
  <div className="d-flex align-items-center justify-content-between py-2 bg-light hoverable px-3 rounded-5 transition-all mb-2">
    <div className="d-flex align-items-center gap-3 overflow-hidden">
      <div className="rounded-circle border d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '35px', height: '35px' }}>
        <Icon path={mdiAccount} size={0.8} className="text-dark" />
      </div>
      <div className="d-flex flex-column overflow-hidden">
        <span className="fw-semibold small text-truncate w-100 d-block">{passengerName}</span>
      </div>
    </div>
    <div className="d-flex align-items-center gap-1 flex-shrink-0 ms-2">
      <Icon path={mdiStar} size={0.6} className="text-dark" />
      <span className="small fw-bold">{rating.toFixed(1)}</span>
    </div>
  </div>
);

export default function Dashboard() {
  const [showTripCard, setShowTripCard] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Driver's current location (mock data)
  const driverLocation = [18.8568, -98.7993]; // Universidad Tecnológica de Emiliano Zapata

  const recentRatings = [
    { id: 1, passengerName: 'Juan Iturbide Ramírez', rating: 5.0 },
    { id: 2, passengerName: 'María López Chavez', rating: 4.5 },
    { id: 3, passengerName: 'Frida Michelle Castro', rating: 4.5 },
  ];

  return (
    <div className="w-100 container pb-3">
      {/* --- MAP AND TRIP REQUEST SECTION --- */}
      <div className="row py-3 position-relative">
        <div className="col-12 d-lg-none">{showTripCard && <TripStatusMobile initialData={location.state} onHide={() => setShowTripCard(false)} />}</div>

        {/* DESKTOP VIEW: Floating component */}
        {showTripCard && (
          <div className="position-absolute end-0 top-0 pe-3 pt-4 d-none d-lg-block" style={{ zIndex: 1010, width: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <TripStatusCard onHide={() => setShowTripCard(false)} initialData={location.state} />
          </div>
        )}

        <div className="col-12">
          <div className="card shadow-sm overflow-hidden">
            <div className="map-container position-relative landing-map-height" onClick={() => setShowTripCard(true)} style={{ cursor: 'pointer' }}>
              <MapView
                center={driverLocation}
                zoom={13}
                height="100%"
                markers={[
                  {
                    position: driverLocation,
                    popup: 'Tu ubicación actual',
                    color: '#a8bf30',
                    type: 'circle'
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </div>

      {/* --- BOTTOM SECTION (3 COLUMNS) --- */}
      <div className="row g-3">
        {/* CARD 1: Tools */}
        <div className="col-12 col-lg-4">
          <div className="card shadow-sm h-100">
            <div className="card-body p-3">
              <h4 className="fw-bold mb-3">Herramientas</h4>
              <div className="row g-2">
                <ToolButton icon={mdiAccountQuestion} label="Ayuda" onClick={() => {}} />
                <ToolButton icon={mdiWallet} label="Billetera" onClick={() => navigate('/d/profile')} />
                <ToolButton icon={mdiBell} label="Notificaciones" onClick={() => navigate('/d/alerts')} />
                <ToolButton icon={mdiFlash} label="Promociones" onClick={() => {}} />
                <ToolButton icon={mdiHistory} label="Mis viajes" onClick={() => navigate('/d/trips')} />
                <ToolButton icon={mdiMessageText} label="Mensajes" onClick={() => navigate('/d/messages')} />
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2: Recent Ratings */}
        <div className="col-12 col-lg-4">
          <div className="card shadow-sm h-100">
            <div className="card-body p-3">
              <h4 className="fw-bold mb-3">Calificaciones Recientes</h4>

              <div className="d-flex flex-column">
                {recentRatings.length > 0 ? (
                  recentRatings.map((rating) => <RatingItem key={rating.id} passengerName={rating.passengerName} rating={rating.rating} />)
                ) : (
                  <div className="text-center text-muted py-4">
                    <p className="mb-0">No hay calificaciones recientes</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CARD 3: My Rating */}
        <div className="col-12 col-lg-4">
          <div className="card shadow-sm h-100">
            <div className="card-body p-3 d-flex flex-column align-items-center justify-content-center text-center">
              <h4 className="fw-bold w-100 text-start mb-3">Mi calificación</h4>

              <div className="d-flex align-items-center gap-2 mb-2">
                <Avatar image={user?.avatar || user?.avatarUrl || "https://primefaces.org/cdn/primereact/images/avatar/xuxuefeng.png"} size="large" shape="circle" className="p-overlay-badge flex-shrink-0" style={{ width: '50px', height: '50px' }} />
                <span className="fs-4 fw-normal">{user?.name} {user?.paternalSurname} {user?.maternalSurname}</span>
              </div>

              <span className="text-muted small mb-3">Conductor</span>

              <div className="d-flex align-items-center gap-2 mb-2">
                <Icon path={mdiStar} size={2.5} style={{ color: 'var(--color-teal-tint-1)' }} />
                <span className="fw-bold" style={{ fontSize: '2.5rem', color: 'var(--color-teal-tint-1)' }}>
                  {user?.rating || '5.0'}
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
