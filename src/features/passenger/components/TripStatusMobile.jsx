import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import Icon from '@mdi/react';
import { mdiCrosshairsGps, mdiArrowRight, mdiHome, mdiCash, mdiStar } from '@mdi/js';

export default function TripStatusMobile({ originValue = '', destinationValue = '', onSelectOriginLocation, onSelectDestinationLocation, selectionMode, onResetTrip, isFormValid }) {
  const [tripState, setTripState] = useState('request');

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
          <div className="flex-shrink-0">
            <Icon path={mdiCrosshairsGps} size={1} className="text-dark" />
          </div>
          <div className="d-flex flex-column lh-1 overflow-hidden w-100">
            <span className="small fw-bold">Origen • 9:04 PM</span>
            <span className="small text-muted text-truncate d-block w-100">
              {originValue || 'Ubicación actual'}
            </span>
          </div>
        </div>
      </div>
      <div className="card bg-light border-secondary border-opacity-25 mb-3">
        <div className="card-body p-2 d-flex align-items-center gap-2">
          <div className="flex-shrink-0">
            <Icon path={mdiHome} size={1} className="text-dark" />
          </div>
          <div className="d-flex flex-column lh-1 overflow-hidden w-100">
            <span className="small fw-bold">Destino • 9:35 PM</span>
            <span className="small text-muted text-truncate d-block w-100">
              {destinationValue || 'Destino seleccionado'}
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
          <span className="fw-normal">$50.00 MXN</span>
        </div>
      </div>
    </div>
  );

  // --- VISTAS ---

  const RequestView = () => (
    <>
      <h5 className="fw-bold mb-3">Solicitar viaje</h5>

      {/* Input Destino */}
      <div className={`d-flex align-items-center bg-secondary bg-opacity-10 rounded-3 p-2 mb-3 justify-content-between ${selectionMode === 'destination' ? 'border border-2 border-info' : ''}`}>
        <InputText readOnly value={destinationValue} onClick={onSelectDestinationLocation} placeholder="¿A dónde vas?" className="bg-transparent border-0 text-dark small fw-semibold p-2 w-100 shadow-none focus:shadow-none" style={{ cursor: 'pointer' }} />
        <div className="cursor-pointer p-2 hoverable" onClick={onSelectDestinationLocation}>
          <Icon path={mdiArrowRight} size={1} className={selectionMode === 'destination' ? 'text-info' : 'text-dark'} />
        </div>
      </div>

      {/* Input Origen */}
      <div
        className={`d-flex align-items-center bg-secondary bg-opacity-10 rounded-3 p-2 mb-3 justify-content-between ${selectionMode === 'origin' ? 'border border-2 border-info' : ''}`}
        style={{ opacity: destinationValue ? 1 : 0.5, pointerEvents: destinationValue ? 'auto' : 'none' }}
      >
        <InputText
          readOnly
          value={originValue}
          onClick={onSelectOriginLocation}
          placeholder="Punto de partida"
          className="bg-transparent border-0 text-dark small fw-semibold p-2 w-100 shadow-none focus:shadow-none"
          style={{ cursor: destinationValue ? 'pointer' : 'default' }}
        />
        <div className="cursor-pointer p-2 hoverable" onClick={onSelectOriginLocation}>
          <Icon path={mdiCrosshairsGps} size={1} className={selectionMode === 'origin' ? 'text-info' : 'text-dark'} />
        </div>
      </div>

      {/* Tarifa Fija Info */}
      <div className="d-flex align-items-center justify-content-between mb-3 px-1">
        <span className="small text-muted fw-bold">Tarifa del viaje (Fija):</span>
        <span className="fw-bold text-success">$50.00 MXN</span>
      </div>

      <Button label="Solicitar Viaje" className="w-100 btn-lime mb-3 border-0" onClick={() => setTripState('searching')} disabled={!isFormValid} />

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

      <Button label="Cancelar solicitud" className="p-button-outlined p-button-secondary p-button-sm w-100 mb-2" onClick={() => setTripState('request')} />
      <small className="text-muted cursor-pointer d-block mt-3" onClick={() => setTripState('pickup')}>
        (Simular conductor encontrado)
      </small>
    </div>
  );

  const PickupView = () => (
    <>
      <h5 className="fw-bold mb-3">¡Tu conductor ha llegado!</h5>

      <div className="alert alert-info border-0 d-flex align-items-center gap-2 mb-3 p-2">
        <Icon path={mdiCrosshairsGps} size={0.8} />
        <small className="fw-semibold" style={{ fontSize: '0.8rem' }}>
          El conductor está esperando.
        </small>
      </div>

      <p className="small text-muted mb-2 fw-bold">Datos del conductor</p>
      <DriverInfo />

      <Button label="Confirmar Inicio" className="w-100 btn-lime mt-3 py-2 fs-6 border-0" icon="pi pi-check" onClick={() => setTripState('ongoing')} />
    </>
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
        <small className="text-muted cursor-pointer" onClick={() => setTripState('dropoff')}>
          Simular llegada
        </small>
      </div>
    </>
  );

  const DropoffView = () => (
    <>
      <h5 className="fw-bold mb-3">Llegada al Destino</h5>

      <div className="alert alert-success bg-opacity-10 border-0 d-flex align-items-center gap-2 mb-3 p-2">
        <Icon path={mdiHome} size={0.8} className="text-success" />
        <small className="fw-bold text-success" style={{ fontSize: '0.8rem' }}>
          Has llegado a tu destino.
        </small>
      </div>

      <p className="small text-muted mb-2 fw-bold">Monto a pagar</p>
      <PaymentDetails />

      <Button label="Confirmar Finalización" className="w-100 btn-lime py-2 mt-3 fs-6 border-0" icon="pi pi-check-circle" onClick={() => setTripState('finished')} />
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
        onClick={() => {
          setTripState('request');
          if (onResetTrip) onResetTrip();
        }}
      />
    </>
  );

  return (
    <div className="card border-0 shadow-sm w-100 mb-3" style={{ borderRadius: '12px' }}>
      <div className="card-body p-4">
        {tripState === 'request' && <RequestView />}
        {tripState === 'searching' && <SearchingView />}
        {tripState === 'pickup' && <PickupView />}
        {tripState === 'ongoing' && <OngoingView />}
        {tripState === 'dropoff' && <DropoffView />}
        {tripState === 'finished' && <FinishedView />}
      </div>
    </div>
  );
}
