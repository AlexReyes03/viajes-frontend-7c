import React, { useState, useMemo } from 'react';
import Icon from '@mdi/react';
import { mdiCurrencyUsd, mdiCarMultiple, mdiStar, mdiDotsHorizontal, mdiCalendar, mdiFilterOff, mdiAccountOutline, mdiCrosshairsGps, mdiCash, mdiMagnify } from '@mdi/js';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Avatar } from 'primereact/avatar';
import { InputText } from 'primereact/inputtext';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import MapThumbnail from '../../../components/global/MapThumbnail';
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
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - Ready to replace with API calls
  const statistics = {
    totalEarnings: 12450.5,
    totalTrips: 156,
    averageRating: 4.8,
  };

  // Mock chart data for statistics cards
  const earningsChartData = [{ value: 8500 }, { value: 9200 }, { value: 10100 }, { value: 9800 }, { value: 11200 }, { value: 12450.5 }];

  const tripsChartData = [{ value: 100 }, { value: 115 }, { value: 128 }, { value: 135 }, { value: 148 }, { value: 156 }];

  const ratingChartData = [{ value: 4.3 }, { value: 4.5 }, { value: 4.6 }, { value: 4.7 }, { value: 4.75 }, { value: 4.8 }];

  const latestTrip = {
    id: 1,
    destination: 'Casa en Privada Valle de San Luis...',
    date: '24 oct',
    time: '03:24 pm',
    amount: 219.41,
    currency: 'MXN',
    origin: { lat: 18.8568, lng: -98.7993, name: 'Universidad Tecnológica' },
    destinationCoords: { lat: 18.87, lng: -98.81, name: 'Casa en Privada Valle' },
    passengerName: 'Carlos Martínez',
    rating: 5,
    fullDate: new Date('2024-10-24'),
  };

  const previousTrips = [
    {
      id: 2,
      destination: 'Casa en Privada Valle de San Luis...',
      date: '22 oct',
      time: '2:22 pm',
      amount: 219.41,
      currency: 'MXN',
      origin: { lat: 18.85, lng: -98.79, name: 'Plaza Las Américas' },
      destinationCoords: { lat: 18.865, lng: -98.8, name: 'Casa en Privada Valle' },
      passengerName: 'María López',
      rating: 4.5,
      fullDate: new Date('2025-10-22'),
    },
    {
      id: 3,
      destination: 'Casa en Privada Valle de San Luis...',
      date: '18 oct',
      time: '6:33 pm',
      amount: 219.41,
      currency: 'MXN',
      origin: { lat: 18.86, lng: -98.805, name: 'Centro Comercial' },
      destinationCoords: { lat: 18.87, lng: -98.81, name: 'Casa en Privada Valle' },
      passengerName: 'Juan Iturbide',
      rating: 5,
      fullDate: new Date('2025-10-18'),
    },
    {
      id: 4,
      destination: 'Casa en Privada Valle de San Luis...',
      date: '15 oct',
      time: '4:15 pm',
      amount: 219.41,
      currency: 'MXN',
      origin: { lat: 18.845, lng: -98.785, name: 'Hospital Regional' },
      destinationCoords: { lat: 18.87, lng: -98.81, name: 'Casa en Privada Valle' },
      passengerName: 'Ana García',
      rating: 4.8,
      fullDate: new Date('2025-10-15'),
    },
  ];

  // Filter trips by search term
  const filteredTrips = useMemo(() => {
    if (!searchTerm) {
      return previousTrips;
    }

    const lowerTerm = searchTerm.toLowerCase();
    return previousTrips.filter((trip) => {
      return trip.destination.toLowerCase().includes(lowerTerm) || trip.passengerName.toLowerCase().includes(lowerTerm) || trip.amount.toString().includes(lowerTerm) || trip.date.toLowerCase().includes(lowerTerm);
    });
  }, [searchTerm, previousTrips]);

  // Filter latest trip
  const filteredLatestTrip = useMemo(() => {
    if (!searchTerm) {
      return latestTrip;
    }
    const lowerTerm = searchTerm.toLowerCase();
    const matches = latestTrip.destination.toLowerCase().includes(lowerTerm) || latestTrip.passengerName.toLowerCase().includes(lowerTerm) || latestTrip.amount.toString().includes(lowerTerm) || latestTrip.date.toLowerCase().includes(lowerTerm);

    return matches ? latestTrip : null;
  }, [searchTerm, latestTrip]);

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
                  <Area type="monotone" dataKey="value" stroke={chartColor} strokeWidth={2.5} fill={`url(#${gradientId})`} />
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
    <div className="card border shadow-sm mb-3 hoverable" style={{ borderRadius: '12px' }} onClick={() => onClick(trip)}>
      <div className="card-body p-3">
        <div className="row align-items-center">
          <div className="col-12 col-md-auto mb-3 mb-md-0">
            <MapThumbnail origin={trip.origin} destination={trip.destinationCoords} size={100} className="trip-card-map-thumbnail" />
          </div>
          <div className="col-12 col-md overflow-hidden">
            <h6 className="fw-bold mb-1 text-dark text-truncate">{trip.destination}</h6>
            <p className="text-muted small mb-1 text-truncate">
              {trip.date} - {trip.time}
            </p>
            <p className="fw-bold mb-0 text-truncate">
              ${trip.amount.toFixed(2)} {trip.currency}
            </p>
          </div>
          <div className="col-12 col-md-auto mt-3 mt-md-0 d-flex justify-content-center justify-content-md-end">
            <Button
              label="Ver detalles"
              outlined
              size="small"
              icon={<Icon path={mdiDotsHorizontal} size={0.7} className="me-1" />}
              style={{ color: 'var(--color-secondary)', borderColor: 'var(--color-secondary)' }}
              className="w-100 w-md-auto"
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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="w-100 container py-4">
      {/* Page Title and Filters */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow-sm border-0" style={{ backgroundColor: '#f8f9fa' }}>
            <div className="card-body p-3">
              <div className="row align-items-center g-3">
                <div className="col-12 col-md-auto me-auto">
                  <h2 className="fw-bold mb-0">Historial de Viajes</h2>
                </div>

                <div className="col-12 col-md-auto">
                  <div className="position-relative">
                    <Icon
                      path={mdiMagnify}
                      size={1}
                      className="position-absolute text-secondary"
                      style={{
                        top: '50%',
                        left: '12px',
                        transform: 'translateY(-50%)',
                        zIndex: 10,
                      }}
                    />
                    <InputText
                      value={searchTerm}
                      onChange={handleSearchChange}
                      placeholder="Buscar..."
                      className="w-100"
                      style={{
                        borderRadius: '12px',
                        paddingLeft: '40px',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards with Charts */}
      <div className="row mb-4">
        <StatCard title="Ingresos Totales" value={`$${statistics.totalEarnings.toLocaleString('es-MX', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}`} icon={mdiCurrencyUsd} chartData={earningsChartData} chartColor="#089b8f" />
        <StatCard title="Total de Viajes" value={statistics.totalTrips} icon={mdiCarMultiple} chartData={tripsChartData} chartColor="#0084c4" />
        <StatCard title="Calificación promedio" value={statistics.averageRating.toFixed(1)} icon={mdiStar} chartData={ratingChartData} chartColor="#a8bf30" />
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
            filteredTrips.map((trip) => <TripCard key={trip.id} trip={trip} onClick={handleViewDetails} />)
          ) : (
            <div className="card shadow-sm border-0" style={{ backgroundColor: '#fff3cd' }}>
              <div className="card-body p-4 text-center">
                <Icon path={mdiCalendar} size={2} className="text-secondary mb-2" />
                <h5 className="fw-semibold mb-2">No hay viajes encontrados</h5>
                <p className="text-muted mb-3">No se encontraron viajes que coincidan con "{searchTerm}".</p>
                <Button label="Limpiar búsqueda" icon={<Icon path={mdiFilterOff} size={0.7} className="me-1" />} onClick={() => setSearchTerm('')} size="small" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Trip Details Dialog */}
      <Dialog header="Detalles del Viaje" visible={showDetailsDialog} onHide={handleCloseDialog} style={{ width: '90vw', maxWidth: '700px' }} draggable={false} resizable={false} className="border-0 shadow" headerClassName="border-0 pb-0 fw-bold" contentClassName="pt-4">
        {selectedTrip && (
          <div className="d-flex flex-column gap-4">
            {/* Mapa */}
            <div style={{ height: '200px', borderRadius: '12px', overflow: 'hidden' }}>
              <MapView
                center={[(selectedTrip.origin.lat + selectedTrip.destinationCoords.lat) / 2, (selectedTrip.origin.lng + selectedTrip.destinationCoords.lng) / 2]}
                zoom={13}
                height="200px"
                markers={[
                  {
                    position: [selectedTrip.origin.lat, selectedTrip.origin.lng],
                    popup: selectedTrip.origin.name,
                    color: '#089b8f',
                  },
                  {
                    position: [selectedTrip.destinationCoords.lat, selectedTrip.destinationCoords.lng],
                    popup: selectedTrip.destinationCoords.name,
                    color: '#a8bf30',
                  },
                ]}
              />
            </div>

            {/* Sección: Pasajero (Adaptado para Conductor) */}
            <div>
              <h6 className="fw-bold mb-3 d-flex align-items-center text-secondary">
                <Icon path={mdiAccountOutline} size={0.9} className="me-2" /> Pasajero
              </h6>
              <div className="d-flex align-items-center gap-3 ps-1">
                <Avatar icon="pi pi-user" size="large" shape="circle" className="bg-secondary bg-opacity-25 text-secondary" />
                <div>
                  <h6 className="fw-normal mb-0 fs-5">{selectedTrip.passengerName}</h6>
                  <div className="small text-muted">
                    <i className="pi pi-star-fill me-1 text-warning" style={{ fontSize: '0.8rem' }}></i>
                    <span className="text-dark fw-bold me-2">{selectedTrip.rating}</span>• {selectedTrip.rating > 4.5 ? 'Viajero Frecuente' : 'Viajero'}
                  </div>
                </div>
              </div>
            </div>

            {/* Sección: Recorrido */}
            <div>
              <h6 className="fw-bold mb-3 d-flex align-items-center text-secondary">
                <Icon path={mdiCrosshairsGps} size={0.9} className="me-2" /> Recorrido
              </h6>

              {/* Card Origen */}
              <div className="card border mb-3 shadow-none bg-light" style={{ borderRadius: '8px' }}>
                <div className="card-body py-2 px-3">
                  <div className="text-dark small mb-0">
                    <span className="text-secondary me-2 fw-bold">Origen • {selectedTrip.date}</span>
                    <div className="text-dark mt-1">{selectedTrip.origin.name}</div>
                  </div>
                </div>
              </div>

              {/* Card Destino */}
              <div className="card border mb-0 shadow-none bg-light" style={{ borderRadius: '8px' }}>
                <div className="card-body py-2 px-3">
                  <div className="text-dark small mb-0">
                    <span className="text-secondary me-2 fw-bold">Destino • {selectedTrip.date}</span>
                    <div className="text-dark mt-1">{selectedTrip.destination}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sección: Detalles del pago */}
            <div>
              <h6 className="fw-bold mb-3 d-flex align-items-center text-secondary">
                <Icon path={mdiCash} size={0.9} className="me-2" /> Detalles del pago
              </h6>
              <div className="card border shadow-none bg-light" style={{ borderRadius: '8px' }}>
                <div className="card-body py-3 px-3">
                  <div className="d-flex flex-column gap-1 small">
                    <div className="d-flex justify-content-between">
                      <span className="fw-bold text-secondary">Método de Pago:</span>
                      <span className="fw-bold text-dark">Efectivo</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="fw-bold text-secondary">Cantidad pagada:</span>
                      <span className="fw-bold text-success">
                        ${selectedTrip.amount.toFixed(2)} {selectedTrip.currency}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="d-flex justify-content-end pt-2">
              <Button label="Cerrar" className="p-button-outlined fw-bold px-4" style={{ color: 'var(--color-secondary)', borderColor: 'var(--color-secondary)' }} onClick={handleCloseDialog} />
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
