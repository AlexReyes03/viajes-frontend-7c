import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import Icon from '@mdi/react';
import { mdiCrosshairsGps, mdiHome, mdiCash, mdiStar } from '@mdi/js';

export default function TripStatusMobile({ onHide, initialData }) {
    const [tripState, setTripState] = useState('request');
    
    // Mock data based on initialData or defaults
    const tripData = initialData || {
        passengerName: 'Carlos Martínez',
        passengerRating: 4.8,
        pickupLocation: 'Universidad Tecnológica de Emiliano Zapata',
        dropoffLocation: 'Plaza Las Américas, Morelos',
        fare: 85.00
    };

    // --- SUB-COMPONENTES ---

    const PassengerInfo = () => (
        <div className="d-flex align-items-center gap-3 mb-3">
            <Avatar icon="pi pi-user" size="large" shape="circle" className="bg-secondary text-white" />
            <div>
                <h6 className="fw-bold mb-0">{tripData.passengerName}</h6>
                <div className="small text-muted d-flex align-items-center gap-1">
                    <Icon path={mdiStar} size={0.7} className="text-dark" />
                    <span className="fw-bold text-dark">{tripData.passengerRating}</span>
                    <span>•</span>
                    <span>Usuario frecuente</span>
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
                        <span className="small text-truncate" style={{ maxWidth: '250px' }}>
                            {tripData.pickupLocation}
                        </span>
                    </div>
                </div>
            </div>
            <div className="card bg-light border-secondary border-opacity-25 mb-3">
                <div className="card-body p-2 d-flex align-items-center gap-2">
                    <Icon path={mdiHome} size={1} className="text-dark" />
                    <div className="d-flex flex-column lh-1">
                        <span className="small fw-bold">Destino</span>
                        <span className="small text-truncate" style={{ maxWidth: '250px' }}>
                            {tripData.dropoffLocation}
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
                    <span className="fs-5 fw-normal">${tripData.fare.toFixed(2)} MXN</span>
                </div>
            </div>
        </div>
    );

    // --- VISTAS ---

    const RequestView = () => (
        <>
            <h5 className="fw-bold mb-3">Solicitud de viaje</h5>
            <p className="small text-muted mb-2 fw-bold">Pasajero</p>
            <PassengerInfo />

            <p className="small text-muted mb-2 fw-bold">Detalles del viaje</p>
            <TripDetails />

            <p className="small text-muted mb-2 fw-bold mt-2">Ganancia estimada</p>
            <PaymentDetails />

            <div className="d-flex gap-2 mt-4">
                <Button
                    label="Rechazar"
                    className="p-button-outlined flex-fill border-0 bg-light text-danger fw-bold hoverable"
                    onClick={onHide}
                />
                <Button
                    label="Aceptar"
                    className="flex-fill btn-lime border-0"
                    onClick={() => setTripState('pickup')}
                />
            </div>
        </>
    );

    const PickupView = () => (
        <>
            <h5 className="fw-bold mb-3">Iniciar Viaje</h5>
            <div className="alert alert-info border-0 d-flex align-items-center gap-2 mb-3 p-2">
                <Icon path={mdiCrosshairsGps} size={0.8} />
                <small className="fw-semibold" style={{ fontSize: '0.8rem' }}>Has llegado al punto de recogida.</small>
            </div>
            
            <p className="small text-muted mb-2 fw-bold">Pasajero</p>
            <PassengerInfo />

            <Button
                label="Confirmar Inicio"
                className="w-100 btn-lime py-2 mt-3 fs-6 border-0"
                icon="pi pi-check"
                onClick={() => setTripState('ongoing')}
            />
        </>
    );

    const OngoingView = () => (
        <>
            <h5 className="fw-bold mb-3">Viaje en curso</h5>
            <p className="small text-muted mb-2 fw-bold">Pasajero</p>
            <PassengerInfo />

            <p className="small text-muted mb-2 fw-bold">Detalles del viaje</p>
            <TripDetails />

            <div className="mt-4">
                <Button
                    label="Llegada al Destino"
                    className="w-100 btn-lime py-2 fs-5 border-0"
                    onClick={() => setTripState('dropoff')}
                />
            </div>
        </>
    );

    const DropoffView = () => (
        <>
            <h5 className="fw-bold mb-3">Finalizar Viaje</h5>
            <div className="alert alert-success bg-opacity-10 border-0 d-flex align-items-center gap-2 mb-3 p-2">
                <Icon path={mdiHome} size={0.8} className="text-success" />
                <small className="fw-bold text-success" style={{ fontSize: '0.8rem' }}>Has llegado al destino.</small>
            </div>

            <p className="small text-muted mb-2 fw-bold">Cobro pendiente</p>
            <PaymentDetails />

            <Button
                label="Confirmar Finalización"
                className="w-100 btn-lime py-2 mt-3 fs-6 border-0"
                icon="pi pi-check-circle"
                onClick={() => setTripState('finished')}
            />
        </>
    );

    const FinishedView = () => (
        <>
            <h5 className="fw-bold mb-3">Resumen del Viaje</h5>
            <div className="text-center mb-4">
                <div className="rounded-circle bg-success bg-opacity-10 d-inline-flex p-3 mb-3">
                    <Icon path={mdiCash} size={2} className="text-success" />
                </div>
                <h3 className="fw-bold text-success mb-0">${tripData.fare.toFixed(2)}</h3>
                <p className="text-muted small">Viaje completado exitosamente</p>
            </div>

            <p className="small text-muted mb-2 fw-bold">Resumen</p>
            <TripDetails />

            <Button
                label="Cerrar"
                className="w-100 btn-lime mt-4 py-2 fs-5 border-0"
                onClick={onHide}
            />
        </>
    );

    return (
        <div className="card border-0 shadow-sm w-100 mb-3" style={{ borderRadius: '12px' }}>
            <div className="card-body p-4">
                {tripState === 'request' && <RequestView />}
                {tripState === 'pickup' && <PickupView />}
                {tripState === 'ongoing' && <OngoingView />}
                {tripState === 'dropoff' && <DropoffView />}
                {tripState === 'finished' && <FinishedView />}
            </div>
        </div>
    );
}

TripStatusMobile.propTypes = {
    onHide: PropTypes.func.isRequired,
    initialData: PropTypes.object,
};