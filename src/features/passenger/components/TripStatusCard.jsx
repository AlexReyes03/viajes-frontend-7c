import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Rating } from 'primereact/rating';
import Icon from '@mdi/react';
import { mdiCrosshairsGps, mdiArrowRight, mdiHome, mdiCash, mdiStar } from '@mdi/js';
import useTariff from '../../../hooks/useTariff';

export default function TripStatusCard({ 
  tripState = 'request', // request, searching, pickup, ongoing, dropoff, finished
  tripData = null,
  originValue = '',
  destinationValue = '',
  onSelectOriginLocation,
  onSelectDestinationLocation,
  selectionMode,
  onResetTrip,
  onRequestTrip,
  onCancelTrip,
  onConfirmPickup,
  onConfirmDropoff,
  isFormValid,
  onRate
}) {
  const [loadingAction, setLoadingAction] = React.useState(null);
  const { tariff } = useTariff();

  React.useEffect(() => {
      setLoadingAction(null);
  }, [tripState]);

  const handleAction = async (actionName, callback) => {
      if (loadingAction) return;
      setLoadingAction(actionName);
      try {
          await callback();
      } catch (error) {
          console.error(error);
          setLoadingAction(null);
      }
  };

  const DriverInfo = () => (
    <div className="d-flex align-items-center gap-3 mb-3">
      <Avatar icon="pi pi-user" size="large" shape="circle" className="bg-secondary text-white" />
      <div>
        <h6 className="fw-bold mb-0">{tripData?.driverName || 'Conductor Asignado'}</h6>
        <div className="small text-muted d-flex align-items-center gap-1">
          <Icon path={mdiStar} size={0.7} className="text-dark" />
          <span className="fw-bold text-dark">4.9</span>
          <span>•</span>
          <span>{tripData?.driverLicense || 'Licencia'}</span>
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
            <span className="small fw-bold">Origen</span>
            <span className="small text-muted text-truncate" style={{ maxWidth: '250px' }}>
              {tripData?.originAddress || tripData?.origin || originValue || 'Ubicación actual'}
            </span>
          </div>
        </div>
      </div>
      <div className="card bg-light border-secondary border-opacity-25 mb-3">
        <div className="card-body p-2 d-flex align-items-center gap-2">
          <Icon path={mdiHome} size={1} className="text-dark" />
          <div className="d-flex flex-column lh-1">
            <span className="small fw-bold">Destino</span>
            <span className="small text-muted text-truncate" style={{ maxWidth: '250px' }}>
              {tripData?.destinationAddress || tripData?.destination || destinationValue || 'Destino seleccionado'}
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
          <span className="fw-normal">${(tripData?.fare || tariff?.tariffValue || 0).toFixed(2)} MXN</span>
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
        <div className="cursor-pointer p-2 hoverable" onClick={onSelectDestinationLocation} title={destinationValue ? 'Borrar ubicación' : 'Seleccionar en mapa'}>
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
        <div className="cursor-pointer p-2 hoverable" onClick={onSelectOriginLocation} title={originValue ? 'Borrar ubicación' : 'Seleccionar en mapa'}>
          <Icon path={mdiCrosshairsGps} size={1} className={selectionMode === 'origin' ? 'text-info' : 'text-dark'} />
        </div>
      </div>

      {/* Tarifa Fija Info */}
      <div className="d-flex align-items-center justify-content-between mb-3 px-1">
        <span className="small text-muted fw-bold">Tarifa del viaje (Fija):</span>
        <span className="fs-5 fw-bold text-success">${(tariff?.tariffValue || 0).toFixed(2)} MXN</span>
      </div>

      <Button 
        label="Solicitar Viaje" 
        className="w-100 btn-lime mb-3 border-0" 
        onClick={() => handleAction('request', onRequestTrip)} 
        disabled={!isFormValid || loadingAction !== null} 
        loading={loadingAction === 'request'}
      />

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

      <Button 
        label="Cancelar solicitud" 
        className="p-button-outlined p-button-secondary p-button-sm w-100 mb-2" 
        onClick={() => handleAction('cancel_search', onCancelTrip)}
        disabled={loadingAction !== null}
        loading={loadingAction === 'cancel_search'}
      />
    </div>
  );

  const PickupView = () => (
    <>
      <h5 className="fw-bold mb-3">Conductor en camino</h5>

      <div className="alert alert-info border-0 d-flex align-items-center gap-2 mb-3">
        <Icon path={mdiCrosshairsGps} size={1} />
        <small className="fw-semibold">El conductor ha aceptado y está en camino.</small>
      </div>

      <p className="small text-muted mb-2 fw-bold">Datos del conductor</p>
      <DriverInfo />
      
      <Button 
        label="Cancelar Viaje" 
        className="w-100 p-button-danger p-button-outlined py-2 fs-6 mt-3" 
        onClick={() => handleAction('cancel_pickup', onCancelTrip)}
        disabled={loadingAction !== null}
        loading={loadingAction === 'cancel_pickup'}
      />
    </>
  );

  const ArrivedView = () => (
    <>
      <h5 className="fw-bold mb-3">¡Tu conductor ha llegado!</h5>

      <div className="alert alert-success bg-opacity-10 border-0 d-flex align-items-center gap-2 mb-3">
        <Icon path={mdiCrosshairsGps} size={1} className="text-success" />
        <small className="fw-semibold text-success">El conductor te espera en el punto de partida.</small>
      </div>

      <p className="small text-muted mb-2 fw-bold">Datos del conductor</p>
      <DriverInfo />

      <p className="text-muted small mb-3">Por favor, aborda el vehículo y confirma el inicio.</p>

      <Button 
        label="Confirmar Inicio de Viaje" 
        className="w-100 btn-lime py-2 fs-6 border-0" 
        icon="pi pi-check" 
        onClick={() => handleAction('start', onConfirmPickup)} 
        disabled={loadingAction !== null}
        loading={loadingAction === 'start'}
      />
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
    </>
  );

  const DropoffView = () => (
    <>
      <h5 className="fw-bold mb-3">Llegada al Destino</h5>

      <div className="alert alert-success bg-opacity-10 border-0 d-flex align-items-center gap-2 mb-3">
        <Icon path={mdiHome} size={1} className="text-success" />
        <small className="fw-bold text-success">El conductor ha marcado el fin del viaje.</small>
      </div>

      <p className="small text-muted mb-2 fw-bold">Monto a pagar</p>
      <PaymentDetails />

      <p className="text-muted small mt-3 mb-4">Por favor realiza el pago al conductor y confirma para finalizar.</p>

      <Button 
        label="Confirmar Finalización" 
        className="w-100 btn-lime py-2 fs-6 border-0" 
        icon="pi pi-check-circle" 
        onClick={() => handleAction('complete', onConfirmDropoff)}
        disabled={loadingAction !== null}
        loading={loadingAction === 'complete'}
      />
    </>
  );

  const FinishedView = () => {
    const [rating, setRating] = React.useState(0);

    return (
      <>
        <h5 className="fw-bold mb-3">Resumen del Viaje</h5>
        <p className="small text-muted mb-2 fw-bold">Datos del conductor</p>
        <DriverInfo />

        <p className="small text-muted mb-2 fw-bold">Detalles del viaje</p>
        <TripDetails />

        <p className="small text-muted mb-2 fw-bold mt-2">Detalles del pago</p>
        <PaymentDetails />

        <h5 className="fw-bold mt-4 mb-2 text-center">Califica al conductor</h5>
        <div className="d-flex justify-content-center mb-3">
            <Rating value={rating} onChange={(e) => setRating(e.value)} cancel={false} stars={5} />
        </div>

        <Button
          label="Enviar"
          className="w-100 btn-lime mt-2 py-2 fs-5 border-0"
          onClick={() => handleAction('rate', () => onRate(rating))}
          disabled={!rating || loadingAction !== null}
          loading={loadingAction === 'rate'}
        />
      </>
    );
  };

  return (
    <div className="card border-0 shadow-lg" style={{ width: '380px', borderRadius: '12px', cursor: 'default' }}>
      <div className="card-body p-4">
        {tripState === 'request' && <RequestView />}
        {tripState === 'searching' && <SearchingView />}
        {tripState === 'pickup' && <PickupView />}
        {tripState === 'arrived' && <ArrivedView />}
        {tripState === 'ongoing' && <OngoingView />}
        {tripState === 'dropoff' && <DropoffView />}
        {tripState === 'finished' && <FinishedView />}
      </div>
    </div>
  );
}
