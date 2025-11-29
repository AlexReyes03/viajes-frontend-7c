import React, { useState, useMemo } from 'react';
import Icon from '@mdi/react';
import { mdiCurrencyUsd, mdiCarMultiple, mdiStar, mdiDotsHorizontal, mdiCalendar, mdiFilterOff } from '@mdi/js';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { Badge } from 'primereact/badge';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import MapThumbnail from '../components/MapThumbnail';
import MapView from '../../../components/global/MapView';

/**
 * TripHistory - Driver Trip History View
 * Shows driver's trip statistics and history
 * 
 * Features:
 * - Total earnings statistics with chart
 * - Total trips count with chart
 * - Average rating with chart
 * - Date range filters
 * - Latest trip activity
 * - Previous trips list
 * 
 * Ready for backend integration:
 * - Replace mock data with API calls
 * - Implement trip details modal
 * - Connect date filters to API
 */
export default function TripHistory() {
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);
    const [dateRange, setDateRange] = useState(null);

    // Mock data - Ready to replace with API calls
    const statistics = {
        totalEarnings: 12450.5,
        totalTrips: 156,
        averageRating: 4.8
    };

    // Mock chart data for statistics cards
    const earningsChartData = [
        { value: 8500 },
        { value: 9200 },
        { value: 10100 },
        { value: 9800 },
        { value: 11200 },
        { value: 12450.5 }
    ];

    const tripsChartData = [
        { value: 100 },
        { value: 115 },
        { value: 128 },
        { value: 135 },
        { value: 148 },
        { value: 156 }
    ];

    const ratingChartData = [
        { value: 4.3 },
        { value: 4.5 },
        { value: 4.6 },
        { value: 4.7 },
        { value: 4.75 },
        { value: 4.8 }
    ];

    const latestTrip = {
        id: 1,
        destination: 'Casa en Privada Valle de San Luis...',
        date: '24 oct',
        time: '03:24 pm',
        amount: 219.41,
        currency: 'MXN',
        origin: { lat: 18.8568, lng: -98.7993, name: 'Universidad Tecnológica' },
        destinationCoords: { lat: 18.8700, lng: -98.8100, name: 'Casa en Privada Valle' },
        passengerName: 'Carlos Martínez',
        rating: 5,
        fullDate: new Date('2024-10-24')
    };

    const previousTrips = [
        {
            id: 2,
            destination: 'Casa en Privada Valle de San Luis...',
            date: '22 oct',
            time: '2:22 pm',
            amount: 219.41,
            currency: 'MXN',
            origin: { lat: 18.8500, lng: -98.7900, name: 'Plaza Las Américas' },
            destinationCoords: { lat: 18.8650, lng: -98.8000, name: 'Casa en Privada Valle' },
            passengerName: 'María López',
            rating: 4.5,
            fullDate: new Date('2025-10-22')
        },
        {
            id: 3,
            destination: 'Casa en Privada Valle de San Luis...',
            date: '18 oct',
            time: '6:33 pm',
            amount: 219.41,
            currency: 'MXN',
            origin: { lat: 18.8600, lng: -98.8050, name: 'Centro Comercial' },
            destinationCoords: { lat: 18.8700, lng: -98.8100, name: 'Casa en Privada Valle' },
            passengerName: 'Juan Iturbide',
            rating: 5,
            fullDate: new Date('2025-10-18')
        },
        {
            id: 4,
            destination: 'Casa en Privada Valle de San Luis...',
            date: '15 oct',
            time: '4:15 pm',
            amount: 219.41,
            currency: 'MXN',
            origin: { lat: 18.8450, lng: -98.7850, name: 'Hospital Regional' },
            destinationCoords: { lat: 18.8700, lng: -98.8100, name: 'Casa en Privada Valle' },
            passengerName: 'Ana García',
            rating: 4.8,
            fullDate: new Date('2025-10-15')
        }
    ];

    // Filter trips by date range
    const filteredTrips = useMemo(() => {
        if (!dateRange || !dateRange[0] || !dateRange[1]) {
            return previousTrips;
        }

        const [startDate, endDate] = dateRange;
        return previousTrips.filter(trip => {
            return trip.fullDate >= startDate && trip.fullDate <= endDate;
        });
    }, [dateRange]);

    // Filter latest trip
    const filteredLatestTrip = useMemo(() => {
        if (!dateRange || !dateRange[0] || !dateRange[1]) {
            return latestTrip;
        }

        const [startDate, endDate] = dateRange;
        if (latestTrip.fullDate >= startDate && latestTrip.fullDate <= endDate) {
            return latestTrip;
        }
        return null;
    }, [dateRange]);

    // Component for statistics cards with charts
    const StatCard = ({ title, value, icon, chartData, chartColor = '#089b8f', iconBgColor = '#E7E0EB' }) => {
        // Create unique ID for gradient to avoid conflicts
        const gradientId = `gradient-${title.replace(/\s+/g, '-')}`;
        
        return (
            <div className="col-12 col-md-4 mb-3 mb-md-0">
                <div className="card shadow-sm h-100">
                    <div className="card-body p-3">
                        <div className="d-flex align-items-start justify-content-between mb-2">
                            <div className="flex-grow-1">
                                <p className="text-muted small mb-1">{title}</p>
                                <h3 className="fw-bold mb-0">{value}</h3>
                            </div>
                            <div
                                className="d-flex align-items-center justify-content-center flex-shrink-0"
                                style={{
                                    backgroundColor: iconBgColor,
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '12px',
                                }}
                            >
                                <Icon path={icon} size={1.2} className="text-dark" />
                            </div>
                        </div>

                        {/* Mini chart */}
                        <div style={{ width: '100%', height: '60px', marginTop: '10px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor={chartColor} stopOpacity={0.6} />
                                            <stop offset="100%" stopColor={chartColor} stopOpacity={0.05} />
                                        </linearGradient>
                                    </defs>
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke={chartColor}
                                        strokeWidth={2.5}
                                        fill={`url(#${gradientId})`}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Component for trip cards
    const TripCard = ({ trip, onClick }) => (
        <div className="card shadow-sm mb-3 hoverable" onClick={() => onClick(trip)}>
            <div className="card-body p-3">
                <div className="row align-items-center">
                    <div className="col-auto">
                        <MapThumbnail
                            origin={trip.origin}
                            destination={trip.destinationCoords}
                            size={80}
                        />
                    </div>
                    <div className="col">
                        <h6 className="fw-semibold mb-1">{trip.destination}</h6>
                        <p className="text-muted small mb-1">
                            {trip.date} - {trip.time}
                        </p>
                        <p className="fw-bold mb-0">
                            ${trip.amount.toFixed(2)} {trip.currency}
                        </p>
                    </div>
                    <div className="col-auto">
                        <Button
                            label="Ver detalles"
                            outlined
                            severity="info"
                            size="small"
                            icon={<Icon path={mdiDotsHorizontal} size={0.7} className="me-1" />}
                            onClick={(e) => {
                                e.stopPropagation();
                                onClick(trip);
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    // Handler functions - Ready for backend integration
    const handleViewDetails = (trip) => {
        console.log('View trip details:', trip);
        setSelectedTrip(trip);
        setShowDetailsDialog(true);
        // TODO: Fetch full trip details from API
    };

    const handleCloseDialog = () => {
        setShowDetailsDialog(false);
        setSelectedTrip(null);
    };

    const handleDateRangeChange = (e) => {
        setDateRange(e.value);
        // TODO: Fetch filtered data from API
        console.log('Date range changed:', e.value);
    };

    const handleClearFilters = () => {
        setDateRange(null);
        // TODO: Reset data from API
        console.log('Filters cleared');
    };

    return (
        <div className="w-100 container py-4">
            {/* Page Title and Filters */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="card shadow-sm border-0" style={{ backgroundColor: '#f8f9fa' }}>
                        <div className="card-body p-3">
                            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-3">
                                <h2 className="fw-bold mb-0">Historial</h2>
                                
                                <div className="d-flex gap-2 align-items-center flex-wrap">
                                    <div className="d-flex align-items-center gap-2">
                                        <span className="small fw-semibold text-dark">Filtrar por fecha:</span>
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <Calendar
                                            value={dateRange}
                                            onChange={handleDateRangeChange}
                                            selectionMode="range"
                                            dateFormat="dd/mm/yy"
                                            placeholder="Seleccionar rango"
                                            showIcon
                                            style={{ minWidth: '250px' }}
                                        />
                                        {dateRange && dateRange[0] && dateRange[1] && (
                                            <Button
                                                label="Limpiar"
                                                outlined
                                                severity="secondary"
                                                size="small"
                                                onClick={handleClearFilters}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistics Cards with Charts */}
            <div className="row mb-4">
                <StatCard
                    title="Ingresos Totales"
                    value={`$${statistics.totalEarnings.toLocaleString('es-MX', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}`}
                    icon={mdiCurrencyUsd}
                    chartData={earningsChartData}
                    chartColor="#089b8f"
                />
                <StatCard
                    title="Total de Viajes"
                    value={statistics.totalTrips}
                    icon={mdiCarMultiple}
                    chartData={tripsChartData}
                    chartColor="#0084c4"
                />
                <StatCard
                    title="Calificación promedio"
                    value={statistics.averageRating.toFixed(1)}
                    icon={mdiStar}
                    chartData={ratingChartData}
                    chartColor="#a8bf30"
                />
            </div>

            {/* Latest Activity Section */}
            {filteredLatestTrip && (
                <div className="row mb-4">
                    <div className="col-12">
                        <h4 className="fw-bold mb-3">Última actividad</h4>
                        <TripCard trip={filteredLatestTrip} onClick={handleViewDetails} />
                    </div>
                </div>
            )}

            {/* Previous Trips Section */}
            <div className="row">
                <div className="col-12">
                    <h4 className="fw-bold mb-3">Anteriores</h4>
                    {filteredTrips.length > 0 ? (
                        filteredTrips.map((trip) => (
                            <TripCard key={trip.id} trip={trip} onClick={handleViewDetails} />
                        ))
                    ) : (
                        <div className="card shadow-sm border-0" style={{ backgroundColor: '#fff3cd' }}>
                            <div className="card-body p-4 text-center">
                                <Icon path={mdiCalendar} size={2} className="text-secondary mb-2" />
                                <h5 className="fw-semibold mb-2">No hay viajes en este rango</h5>
                                <p className="text-muted mb-3">
                                    No se encontraron viajes en el rango de fechas seleccionado.
                                    {dateRange && ' Intenta seleccionar un rango diferente.'}
                                </p>
                                {dateRange && (
                                    <Button
                                        label="Ver todos los viajes"
                                        icon={<Icon path={mdiFilterOff} size={0.7} className="me-1" />}
                                        onClick={handleClearFilters}
                                        size="small"
                                    />
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Trip Details Dialog */}
            <Dialog
                header={selectedTrip ? 'Detalles del Viaje' : ''}
                visible={showDetailsDialog}
                style={{ width: '90vw', maxWidth: '600px' }}
                onHide={handleCloseDialog}
            >
                {selectedTrip && (
                    <div className="p-3">
                        {/* Trip Details Content */}
                        <div className="mb-3">
                            <div className="mb-3" style={{ width: '100%', height: '200px', borderRadius: '12px', overflow: 'hidden' }}>
                                <MapView
                                    center={[(selectedTrip.origin.lat + selectedTrip.destinationCoords.lat) / 2,
                                    (selectedTrip.origin.lng + selectedTrip.destinationCoords.lng) / 2]}
                                    zoom={13}
                                    height="200px"
                                    markers={[
                                        {
                                            position: [selectedTrip.origin.lat, selectedTrip.origin.lng],
                                            popup: selectedTrip.origin.name,
                                            color: '#089b8f'
                                        },
                                        {
                                            position: [selectedTrip.destinationCoords.lat, selectedTrip.destinationCoords.lng],
                                            popup: selectedTrip.destinationCoords.name,
                                            color: '#a8bf30'
                                        }
                                    ]}
                                />
                            </div>

                            <div className="mb-3">
                                <h5 className="fw-bold mb-3">Información del Viaje</h5>

                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Pasajero:</span>
                                    <span className="fw-semibold">{selectedTrip.passengerName}</span>
                                </div>

                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Origen:</span>
                                    <span className="fw-semibold text-end">{selectedTrip.origin.name}</span>
                                </div>

                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Destino:</span>
                                    <span className="fw-semibold text-end">{selectedTrip.destination}</span>
                                </div>

                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Fecha y hora:</span>
                                    <span className="fw-semibold">{selectedTrip.date} - {selectedTrip.time}</span>
                                </div>

                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Calificación:</span>
                                    <span className="fw-semibold">
                                        <Icon path={mdiStar} size={0.7} className="text-warning me-1" />
                                        {selectedTrip.rating}
                                    </span>
                                </div>

                                <hr />

                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="fw-bold fs-5">Total:</span>
                                    <span className="fw-bold fs-4" style={{ color: 'var(--color-teal-tint-1)' }}>
                                        ${selectedTrip.amount.toFixed(2)} {selectedTrip.currency}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Dialog>
        </div>
    );
}

