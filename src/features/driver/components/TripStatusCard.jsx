import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@mdi/react';
import { mdiClose, mdiMapMarker, mdiClockOutline, mdiCash, mdiAccount } from '@mdi/js';
import { Button } from 'primereact/button';

/**
 * TripStatusCard - Desktop version
 * Shows trip request details in a floating card on desktop view
 * 
 * Props:
 * - onHide: Function to hide the card
 * - initialData: Object with trip data from navigation state
 * 
 * Ready for backend integration:
 * - Replace mock data with API calls
 * - Add accept/reject trip handlers
 * - Implement real-time updates via WebSocket
 */
const TripStatusCard = ({ onHide, initialData = null }) => {
    // Mock data - Ready to replace with API data
    const tripData = initialData || {
        passengerId: 'P12345',
        passengerName: 'Carlos Martínez',
        passengerRating: 4.8,
        pickupLocation: 'Universidad Tecnológica de Emiliano Zapata',
        dropoffLocation: 'Plaza Las Américas, Morelos',
        estimatedDuration: '15 min',
        estimatedDistance: '8.5 km',
        estimatedFare: 85.00,
        status: 'pending', // pending, accepted, in-progress, completed
    };

    // Handler functions - 
    const handleAcceptTrip = () => {
        console.log('Trip accepted:', tripData);
        // TODO: Call API to accept trip
        // TODO: Update trip status
        // TODO: Navigate to trip in progress view
    };

    const handleRejectTrip = () => {
        console.log('Trip rejected:', tripData);
        // TODO: Call API to reject trip
        onHide();
    };

    return (
        <div className="card shadow-lg" style={{ width: '350px', maxWidth: '90vw' }}>
            <div className="card-body p-3">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="fw-bold mb-0">Nueva Solicitud de Viaje</h5>
                    <button
                        type="button"
                        className="btn-close"
                        aria-label="Close"
                        onClick={onHide}
                        style={{ padding: '0.25rem' }}
                    />
                </div>

                {/* Passenger Info */}
                <div className="d-flex align-items-center gap-2 mb-3 p-2 bg-light rounded">
                    <div className="rounded-circle bg-white d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                        <Icon path={mdiAccount} size={1} style={{ color: 'var( --color-secondary)' }} />
                    </div>
                    <div className="flex-grow-1">
                        <p className="mb-0 fw-semibold">{tripData.passengerName}</p>
                        <div className="d-flex align-items-center gap-1">
                            <span className="small text-warning">★</span>
                            <span className="small text-muted">{tripData.passengerRating}</span>
                        </div>
                    </div>
                </div>

                {/* Trip Details */}
                <div className="mb-3">
                    {/* Pickup Location */}
                    <div className="d-flex gap-2 mb-2">
                        <Icon path={mdiMapMarker} size={0.8} style={{ color: 'var(--color-secondary)' }} />
                        <div className="flex-grow-1">
                            <p className="small text-muted mb-0">Origen</p>
                            <p className="small fw-semibold mb-0">{tripData.pickupLocation}</p>
                        </div>
                    </div>

                    <div className="border-start ms-2 ps-3" style={{ borderWidth: '2px', marginLeft: '0.4rem' }}>
                        {/* Drop-off Location */}
                        <div className="d-flex gap-2 mt-2">
                            <Icon path={mdiMapMarker} size={0.8} style={{ color: 'var(--color-lime-tint-1)' }} />
                            <div className="flex-grow-1">
                                <p className="small text-muted mb-0">Destino</p>
                                <p className="small fw-semibold mb-0">{tripData.dropoffLocation}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Trip Info*/}
                <div className="row g-2 mb-3">
                    <div className="col-6">
                        <div className="p-2 bg-light rounded text-center">
                            <Icon path={mdiClockOutline} size={0.7} className="text-muted mb-1" />
                            <p className="small mb-0">{tripData.estimatedDuration}</p>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="p-2 bg-light rounded text-center">
                            <Icon path={mdiCash} size={0.7} className="text-muted mb-1" />
                            <p className="small mb-0 fw-bold">${tripData.estimatedFare.toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="d-flex gap-2">
                    <Button
                        label="Rechazar"
                        outlined
                        onClick={handleRejectTrip}
                        className="flex-fill"
                    />
                    <Button
                        label="Aceptar"
                        onClick={handleAcceptTrip}
                        className="flex-fill"
                    />
                </div>
            </div>
        </div>
    );
};

TripStatusCard.propTypes = {
    onHide: PropTypes.func.isRequired,
    initialData: PropTypes.shape({
        passengerId: PropTypes.string,
        passengerName: PropTypes.string,
        passengerRating: PropTypes.number,
        pickupLocation: PropTypes.string,
        dropoffLocation: PropTypes.string,
        estimatedDuration: PropTypes.string,
        estimatedDistance: PropTypes.string,
        estimatedFare: PropTypes.number,
        status: PropTypes.string,
    }),
};

export default TripStatusCard;

