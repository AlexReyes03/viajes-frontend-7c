import React from 'react';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Rating } from 'primereact/rating';
import Icon from '@mdi/react';
import { mdiCrosshairsGps, mdiArrowRight, mdiHome, mdiCash, mdiStar } from '@mdi/js';
import useTariff from '../../../hooks/useTariff';
import CancelTripModal from '../../../components/global/CancelTripModal';

export default function TripStatusMobile({ 
  tripState = 'request',
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
  onHide,
  onRate
}) {
  const [loadingAction, setLoadingAction] = React.useState(null);
  const [showCancelModal, setShowCancelModal] = React.useState(false);
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

  const handleCancelWithReason = async (reason) => {
    await handleAction('cancel', () => onCancelTrip(reason));
    setShowCancelModal(false);
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

  const VehicleInfo = () => {
    if (!tripData?.vehicleBrand) return null;

    return (
      <div className="card bg-light border-secondary border-opacity-25 mb-3">
        <div className="card-body p-3">
          <p className="small text-muted mb-2 fw-bold">Información del vehículo</p>
          <div className="d-flex flex-column gap-1">
            <div className="d-flex justify-content-between">
              <span className="small text-muted">Vehículo:</span>
              <span className="small fw-semibold">
                {tripData.vehicleBrand} {tripData.vehicleModel} {tripData.vehicleYear ? `(${tripData.vehicleYear})` : ''}
              </span>
            </div>
            <div className="d-flex justify-content-between">
              <span className="small text-muted">Placas:</span>
              <span className="small fw-semibold">{tripData.vehiclePlate}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span className="small text-muted">Color:</span>
              <span className="small fw-semibold">{tripData.vehicleColor}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const TripDetails = () => (
    <>
      <div className="card bg-light border-secondary border-opacity-25 mb-2">
        <div className="card-body p-2 d-flex align-items-center gap-2">
          <div className="flex-shrink-0">
            <Icon path={mdiCrosshairsGps} size={1} className="text-dark" />
          </div>
          <div className="d-flex flex-column lh-1 overflow-hidden w-100">
            <span className="small fw-bold">Origen</span>
            <span className="small text-muted text-truncate d-block w-100">
              {tripData?.originAddress || tripData?.origin || originValue || 'Ubicación actual'}
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
            <span className="small fw-bold">Destino</span>
            <span className="small text-muted text-truncate d-block w-100">
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
          <span className="fw-normal">${(tariff?.tariffValue || 0).toFixed(2)} MXN</span>
        </div>
      </div>
    </div>
  );

  // --- VISTAS ---

  const RequestView = () => (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold mb-0">Solicitar viaje</h5>
      </div>

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
        <span className="fw-bold text-success">${(tariff?.tariffValue || 0).toFixed(2)} MXN</span>
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
      <p className="text-muted small mb-4">Estamos contactando a los conductores cercanos.</p>

      <Button
        label="Cancelar solicitud"
        className="p-button-outlined p-button-secondary p-button-sm w-100 mb-2"
        onClick={() => setShowCancelModal(true)}
        disabled={loadingAction !== null}
      />
    </div>
  );

  const PickupView = () => (
    <>
      <h5 className="fw-bold mb-3">Conductor en camino</h5>

      <div className="alert alert-info border-0 d-flex align-items-center gap-2 mb-3 p-2">
        <Icon path={mdiCrosshairsGps} size={0.8} />
        <small className="fw-semibold" style={{ fontSize: '0.8rem' }}>
          El conductor ha aceptado y está en camino.
        </small>
      </div>

      <p className="small text-muted mb-2 fw-bold">Datos del conductor</p>
      <DriverInfo />
      <VehicleInfo />

      <Button
        label="Cancelar Viaje"
        className="w-100 p-button-danger p-button-outlined mt-3 py-2 fs-6"
        onClick={() => setShowCancelModal(true)}
        disabled={loadingAction !== null}
      />
    </>
  );

  const ArrivedView = () => (
    <>
      <h5 className="fw-bold mb-3">¡Tu conductor ha llegado!</h5>

      <div className="alert alert-success bg-opacity-10 border-0 d-flex align-items-center gap-2 mb-3 p-2">
        <Icon path={mdiCrosshairsGps} size={0.8} className="text-success" />
        <small className="fw-semibold text-success" style={{ fontSize: '0.8rem' }}>
          El conductor te espera en el punto de partida.
        </small>
      </div>

      <p className="small text-muted mb-2 fw-bold">Datos del conductor</p>
      <DriverInfo />
      <VehicleInfo />

      <Button
        label="Confirmar Inicio"
        className="w-100 btn-lime py-2 mt-3 fs-6 border-0"
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
      <VehicleInfo />

      <p className="small text-muted mb-2 fw-bold">Detalles del viaje</p>
      <TripDetails />

      <p className="small text-muted mb-2 fw-bold mt-2">Detalles del pago</p>
      <PaymentDetails />
    </>
  );

  const DropoffView = () => (
    <>
      <h5 className="fw-bold mb-3">Llegada al Destino</h5>

      <div className="alert alert-success bg-opacity-10 border-0 d-flex align-items-center gap-2 mb-3 p-2">
        <Icon path={mdiHome} size={0.8} className="text-success" />
        <small className="fw-bold text-success" style={{ fontSize: '0.8rem' }}>
          El conductor ha marcado el fin del viaje.
        </small>
      </div>

      <p className="small text-muted mb-2 fw-bold">Monto a pagar</p>
      <PaymentDetails />

      <p className="text-muted small mt-3 mb-4">Por favor realiza el pago al conductor y confirma para finalizar.</p>

      <Button 
        label="Confirmar Finalización" 
        className="w-100 btn-lime py-2 mt-3 fs-6 border-0" 
        icon="pi pi-check-circle" 
        onClick={() => handleAction('complete', onConfirmDropoff)}
        disabled={loadingAction !== null}
        loading={loadingAction === 'complete'}
      />
    </>
  );

  const FinishedView = () => {
    const [rating, setRating] = React.useState(0);
    const [comment, setComment] = React.useState('');
    const MAX_COMMENT_LENGTH = 500;

    return (
      <>
        <h5 className="fw-bold mb-3">Resumen del Viaje</h5>
        <p className="small text-muted mb-2 fw-bold">Datos del conductor</p>
        <DriverInfo />
        <VehicleInfo />

        <p className="small text-muted mb-2 fw-bold">Detalles del viaje</p>
        <TripDetails />

        <p className="small text-muted mb-2 fw-bold mt-2">Detalles del pago</p>
        <PaymentDetails />

        <h5 className="fw-bold mt-4 mb-2 text-center">Califica al conductor</h5>
        <div className="d-flex justify-content-center mb-3">
            <Rating value={rating} onChange={(e) => setRating(e.value)} cancel={false} stars={5} />
        </div>

        <div className="mb-3">
          <label htmlFor="comment" className="form-label small fw-semibold">Comentario (opcional)</label>
          <InputTextarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value.slice(0, MAX_COMMENT_LENGTH))}
            rows={3}
            placeholder="Cuéntanos sobre tu experiencia..."
            className="w-100"
          />
          <div className="text-end">
            <small className={comment.length > MAX_COMMENT_LENGTH * 0.9 ? 'text-danger' : 'text-muted'}>
              {comment.length}/{MAX_COMMENT_LENGTH}
            </small>
          </div>
        </div>

        <Button
          label="Enviar"
          className="w-100 btn-lime mt-2 py-2 fs-5 border-0"
          onClick={() => handleAction('rate', () => onRate(rating, comment))}
          disabled={!rating || loadingAction !== null}
          loading={loadingAction === 'rate'}
        />
      </>
    );
  };

  return (
    <>
      <div className="card border-0 shadow-sm w-100 mb-3" style={{ borderRadius: '12px' }}>
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

      <CancelTripModal
        visible={showCancelModal}
        onHide={() => setShowCancelModal(false)}
        onConfirm={handleCancelWithReason}
        loading={loadingAction === 'cancel'}
      />
    </>
  );
}
