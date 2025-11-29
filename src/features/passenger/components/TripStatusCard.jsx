import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import Icon from '@mdi/react';
import { mdiCrosshairsGps, mdiArrowRight, mdiHome, mdiCash, mdiStar } from '@mdi/js';

export default function TripStatusCard({ onHide, initialData }) {
  const [tripState, setTripState] = useState('request');
  const [origin, setOrigin] = useState(initialData?.origin || '');
  const [destination, setDestination] = useState(initialData?.destination || '');

  // --- SUB-COMPONENTES ---

  const DriverInfo = () => (
    <div className="d-flex align-items-center gap-3 mb-3">
      <Avatar icon="pi pi-user" size="large" shape="circle" className="bg-secondary text-white" />
      <div>
        <h6 className="fw-bold mb-0">Ignacio Sánchez Ramírez</h6>
        <div className="small text-muted d-flex align-items-center gap-1">
          <Icon path={mdiStar} size={0.7} className="text-dark" />
          <span className="fw-bold text-dark">4.9</span>
          <span>•</span>
          <span>512 viajes completados</span>
        </div>
      </div>
    </div>
  );

  const TripDetails = () => (
    <>
      <div className="card bg-light border-secondary border-opacity-25 mb-2">
        <div className="card-body p-2 d-flex align-items-center gap-2">
          <Icon path={mdiCrosshairsGps} size={1} className="text-dark" />
          <div className="d-flex flex-column lh-1">
            <span className="small fw-bold">Origen • 9:04 PM</span>
            <span className="small text-muted text-truncate" style={{ maxWidth: '250px' }}>
              {origin || 'Ubicación actual'}
            </span>
          </div>
        </div>
      </div>
      <div className="card bg-light border-secondary border-opacity-25 mb-3">
        <div className="card-body p-2 d-flex align-items-center gap-2">
          <Icon path={mdiHome} size={1} className="text-dark" />
          <div className="d-flex flex-column lh-1">
            <span className="small fw-bold">Destino • 9:35 PM</span>
            <span className="small text-muted text-truncate" style={{ maxWidth: '250px' }}>
              {destination || 'Destino seleccionado'}
            </span>
          </div>
        </div>
      </div>
    </>
  );

  const PaymentDetails = () => (
    <div className="card bg-light border-secondary border-opacity-25">
      <div className="card-body p-2 d-flex align-items-center gap-2">
        <Icon path={mdiCash} size={1} className="text-dark" />
        <div className="d-flex flex-column lh-1">
          <span className="small fw-bold">Efectivo</span>
          <span className="fs-5 fw-normal">$50.00 MXN</span>
        </div>
      </div>
    </div>
  );

  // --- VISTAS ---

  const RequestView = () => (
    <>
      <h5 className="fw-bold mb-3">Solicitar viaje</h5>

      {/* Input Origen */}
      <div className="d-flex align-items-center bg-secondary bg-opacity-10 rounded-3 p-2 mb-3 justify-content-between">
        <InputText value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="Ingrese punto de partida" className="bg-transparent border-0 text-dark small fw-semibold p-2 w-100 shadow-none focus:shadow-none" />
        <div className="cursor-pointer p-2 hoverable" onClick={onHide} title="Cambiar origen">
          <Icon path={mdiCrosshairsGps} size={1} className="text-dark" />
        </div>
      </div>

      {/* Input Destino */}
      <div className="d-flex align-items-center bg-secondary bg-opacity-10 rounded-3 p-0 mb-3 overflow-hidden">
        <InputText value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Ingrese destino" className="bg-transparent border-0 text-dark small fw-semibold p-3 w-100 shadow-none focus:shadow-none" />
        <div
          className="d-flex align-items-center justify-content-center h-100 px-3 cursor-pointer btn-lime"
          style={{ width: '60px', minHeight: '54px' }}
          onClick={() => setTripState('searching')} // Acción para buscar conductor
        >
          <Icon path={mdiArrowRight} size={1.2} color="#fff" />
        </div>
      </div>

      {/* Tarifa Fija Info */}
      <div className="d-flex align-items-center justify-content-between mb-3 px-1">
        <span className="small text-muted fw-bold">Tarifa del viaje (Fija):</span>
        <span className="fs-5 fw-bold text-success">$50.00 MXN</span>
      </div>

      <a href="#" className="small text-decoration-underline text-dark fw-semibold">
        Información sobre viajes
      </a>
    </>
  );

  const SearchingView = () => (
    <div className="text-center py-4">
      <h5 className="fw-bold mb-4">Buscando conductor...</h5>
      <div className="mb-4">
        <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="4" animationDuration=".5s" />
      </div>
      <p className="text-muted small mb-4">Estamos contactando a los conductores cercanos. Por favor espera un momento.</p>

      {/* Simulación de conductor encontrado */}
      <Button label="Cancelar solicitud" className="p-button-outlined p-button-secondary p-button-sm w-100 mb-2" onClick={() => setTripState('request')} />
      <small className="text-muted cursor-pointer d-block mt-3" onClick={() => setTripState('ongoing')}>
        (Simular conductor encontrado)
      </small>
    </div>
  );

  const OngoingView = () => (
    <>
      <h5 className="fw-bold mb-3">Tu viaje está en curso</h5>
      <p className="small text-muted mb-2 fw-bold">Datos del conductor</p>
      <DriverInfo />

      <p className="small text-muted mb-2 fw-bold">Detalles del viaje</p>
      <TripDetails />

      <p className="small text-muted mb-2 fw-bold mt-2">Detalles del pago</p>
      <PaymentDetails />

      <div className="mt-3 text-end">
        <small className="text-muted cursor-pointer" onClick={() => setTripState('finished')}>
          Simular llegada
        </small>
      </div>
    </>
  );

  const FinishedView = () => (
    <>
      <h5 className="fw-bold mb-3">Has llegado a tu destino</h5>
      <p className="small text-muted mb-2 fw-bold">Datos del conductor</p>
      <DriverInfo />

      <p className="small text-muted mb-2 fw-bold">Detalles del viaje</p>
      <TripDetails />

      <p className="small text-muted mb-2 fw-bold mt-2">Detalles del pago</p>
      <PaymentDetails />

      <Button
        label="Finalizar Viaje"
        className="w-100 btn-lime mt-4 py-2 fs-5 border-0"
        onClick={() => setTripState('request')} // Reiniciar ciclo
      />
    </>
  );

  return (
    <div className="card border-0 shadow-lg" style={{ width: '380px', borderRadius: '12px', cursor: 'default' }}>
      <div className="card-body p-4">
        {tripState === 'request' && <RequestView />}
        {tripState === 'searching' && <SearchingView />}
        {tripState === 'ongoing' && <OngoingView />}
        {tripState === 'finished' && <FinishedView />}
      </div>
    </div>
  );
}
