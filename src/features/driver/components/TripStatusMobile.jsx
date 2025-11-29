import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@mdi/react';
import { mdiMapMarker, mdiClockOutline, mdiCurrencyUsd, mdiAccount } from '@mdi/js';
import { Button } from 'primereact/button';

/**
 * TripStatusMobile - Mobile version
 * Shows trip request details in a static card on mobile view
 * 
 * Props:
 * - initialData: Object with trip data from navigation state
 * 
 * Ready for backend integration:
 * - Replace mock data with API calls
 * - Add accept/reject trip handlers
 * - Implement real-time updates via WebSocket
 */
const TripStatusMobile = ({ initialData = null }) => {
    // Mock data 
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

    // Handler functions
    const handleAcceptTrip = () => {
        console.log('Trip accepted:', tripData);
        // TODO: Call API to accept trip
        // TODO: Update trip status
        // TODO: Navigate to trip in progress view
    };

    const handleRejectTrip = () => {
        console.log('Trip rejected:', tripData);
    };

    return (
        <div className="card shadow-sm mb-3">
            <div className="card-body p-3">
                {/* Header */}
                <h6 className="fw-bold mb-3">Nueva Solicitud</h6>

                {/* Passenger Info */}
                <div className="d-flex align-items-center gap-2 mb-3 p-2 bg-light rounded">
                    <div className="rounded-circle bg-white d-flex align-items-center justify-content-center" style={{ width: '35px', height: '35px' }}>
                        <Icon path={mdiAccount} size={0.8} className="text-secondary" />
                    </div>
                    <div className="flex-grow-1">
                        <p className="mb-0 fw-semibold small">{tripData.passengerName}</p>
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
                        <Icon path={mdiMapMarker} size={0.7} style={{ color: 'var(--color-teal-tint-1)' }} />
                        <div className="flex-grow-1">
                            <p className="small text-muted mb-0">Origen</p>
                            <p className="small fw-semibold mb-0">{tripData.pickupLocation}</p>
                        </div>
                    </div>

                    <div className="border-start ms-2 ps-2" style={{ borderWidth: '2px', marginLeft: '0.3rem' }}>
                        {/* Drop-off Location */}
                        <div className="d-flex gap-2 mt-2">
                            <Icon path={mdiMapMarker} size={0.7} style={{ color: 'var(--color-lime-tint-1)' }} />
                            <div className="flex-grow-1">
                                <p className="small text-muted mb-0">Destino</p>
                                <p className="small fw-semibold mb-0">{tripData.dropoffLocation}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Trip Info Grid */}
                <div className="row g-2 mb-3">
                    <div className="col-6">
                        <div className="p-2 bg-light rounded text-center">
                            <Icon path={mdiClockOutline} size={0.6} className="text-muted mb-1" />
                            <p className="small mb-0">{tripData.estimatedDuration}</p>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="p-2 bg-light rounded text-center">
                            <Icon path={mdiCurrencyUsd} size={0.6} className="text-muted mb-1" />
                            <p className="small mb-0 fw-bold">${tripData.estimatedFare.toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="d-flex gap-2">
                    <Button
                        label="Rechazar"
                        severity="danger"
                        outlined
                        onClick={handleRejectTrip}
                        className="flex-fill"
                        size="small"
                    />
                    <Button
                        label="Aceptar"
                        onClick={handleAcceptTrip}
                        className="flex-fill"
                        size="small"
                    />
                </div>
            </div>
        </div>
    );
};

TripStatusMobile.propTypes = {
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

export default TripStatusMobile;

