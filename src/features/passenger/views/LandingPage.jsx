import React from 'react';
import Icon from '@mdi/react';
import { mdiAccountQuestion, mdiWallet, mdiBell, mdiFlash, mdiHistory, mdiMessageText, mdiHomeOutline, mdiStar, mdiMapMarker } from '@mdi/js';
import { Avatar } from 'primereact/avatar';

export default function LandingPage() {
  // Componente interno para los botones de Herramientas
  const ToolButton = ({ icon, label }) => (
    <div className="col-4 mb-3">
      <div className="d-flex flex-column align-items-center justify-content-center p-3 rounded-3 h-100 tool-btn">
        <Icon path={icon} size={1.2} className="mb-2 text-dark" />
        <span className="small fw-semibold text-dark">{label}</span>
      </div>
    </div>
  );

  // Componente interno para items de Actividad
  const ActivityItem = ({ icon, address, rating }) => (
    <div className="d-flex align-items-center justify-content-between py-3 border-bottom">
      <div className="d-flex align-items-center gap-3">
        <div className="rounded-circle border d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
          <Icon path={icon} size={0.9} className="text-dark" />
        </div>
        <div className="d-flex flex-column">
          <span className="fw-semibold small text-truncate" style={{ maxWidth: '180px' }}>
            {address}
          </span>
        </div>
      </div>
      <div className="d-flex align-items-center gap-1">
        <Icon path={mdiStar} size={0.7} className="text-dark" />
        <span className="small fw-bold">{rating}</span>
      </div>
    </div>
  );

  return (
    <div className="container-fluid p-4">
      {/* --- SECCIÓN DEL MAPA --- */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm overflow-hidden" style={{ borderRadius: '12px' }}>
            {/* Simulador de Mapa (Puedes reemplazar esto con Google Maps o Leaflet) */}
            <div className="map-container bg-light position-relative" style={{ height: '400px', backgroundImage: 'url(https://mt1.google.com/vt/lyrs=m&x=1325&y=3143&z=13)', backgroundSize: 'cover' }}>
              {/* Ejemplo de marcador en el mapa */}
              <div className="position-absolute top-50 start-50 translate-middle">
                <Icon path={mdiMapMarker} size={2} color="var(--color-lime-tint-1)" className="drop-shadow" />
              </div>

              {/* Controles simulados del mapa */}
              <div className="position-absolute bottom-0 end-0 m-3 bg-white p-2 rounded shadow-sm">
                <span className="small text-muted">© OpenStreetMap</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- SECCIÓN INFERIOR (3 COLUMNAS) --- */}
      <div className="row g-4">
        {/* TARJETA 1: Herramientas */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-4">Herramientas</h6>
              <div className="row g-2">
                <ToolButton icon={mdiAccountQuestion} label="Ayuda" />
                <ToolButton icon={mdiWallet} label="Billetera" />
                <ToolButton icon={mdiBell} label="Notifica..." />
                <ToolButton icon={mdiFlash} label="App Plus" />
                <ToolButton icon={mdiHistory} label="Mis viajes" />
                <ToolButton icon={mdiMessageText} label="Mensajes" />
              </div>
            </div>
          </div>
        </div>

        {/* TARJETA 2: Actividad Reciente */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3">Actividad reciente</h6>

              <div className="d-flex flex-column">
                <ActivityItem icon={mdiHomeOutline} address="Casa en Privada Valle de San..." rating="5.0" />
                <ActivityItem icon={mdiHistory} address="Tractor Verde, 53, Colonia Azt..." rating="4.5" />
                <ActivityItem icon={mdiHistory} address="Av. Universidad Tecnológica, ..." rating="4.5" />
              </div>
            </div>
          </div>
        </div>

        {/* TARJETA 3: Mi Calificación */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
            <div className="card-body p-4 d-flex flex-column align-items-center justify-content-center text-center">
              <h6 className="fw-bold w-100 text-start mb-4">Mi calificación</h6>

              {/* Usuario */}
              <div className="d-flex align-items-center gap-3 mb-3">
                <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" size="large" shape="circle" className="p-overlay-badge" style={{ width: '60px', height: '60px' }} />
                <span className="fs-4 fw-normal">Alejandro Reyes</span>
              </div>

              {/* Estrellas */}
              <div className="d-flex align-items-center gap-2 mb-4">
                <Icon path={mdiStar} size={2.5} style={{ color: 'var(--color-teal-tint-1)' }} />
                <span className="fw-bold" style={{ fontSize: '2.5rem', color: 'var(--color-teal-tint-1)' }}>
                  4.5
                </span>
              </div>

              {/* Link inferior */}
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
