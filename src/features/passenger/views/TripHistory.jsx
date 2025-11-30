import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import Icon from '@mdi/react';
import { mdiRefresh, mdiDotsHorizontal, mdiAccountOutline, mdiCrosshairsGps, mdiCash, mdiMagnify, mdiFilterOff, mdiCalendar } from '@mdi/js';
import { Avatar } from 'primereact/avatar';
import MapView from '../../../components/global/MapView';
import MapThumbnail from '../../../components/global/MapThumbnail';

export default function TripHistory() {
  const navigate = useNavigate();
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const trips = [
    {
      id: 1,
      address: 'Casa en Privada Valle de San Luis...',
      date: '24 oct - 1:06 pm',
      price: '$219.41 MXN',
      origin: { lat: 18.8568, lng: -98.7993, name: 'Universidad Tecnológica' },
      destination: { lat: 18.87, lng: -98.81, name: 'Casa en Privada Valle' },
      isLatest: true,
    },
    {
      id: 2,
      address: 'Casa en Privada Valle de San Luis...',
      date: '22 oct - 2:22 pm',
      price: '$219.41 MXN',
      origin: { lat: 18.85, lng: -98.79, name: 'Plaza Las Américas' },
      destination: { lat: 18.865, lng: -98.8, name: 'Casa en Privada Valle' },
      isLatest: false,
    },
    {
      id: 3,
      address: 'Casa en Privada Valle de San Luis...',
      date: '18 oct - 6:33 pm',
      price: '$219.41 MXN',
      origin: { lat: 18.86, lng: -98.805, name: 'Centro Comercial' },
      destination: { lat: 18.87, lng: -98.81, name: 'Casa en Privada Valle' },
      isLatest: false,
    },
    {
      id: 4,
      address: 'Casa en Privada Valle de San Luis...',
      date: '15 oct - 12:44 pm',
      price: '$219.41 MXN',
      origin: { lat: 18.845, lng: -98.785, name: 'Hospital Regional' },
      destination: { lat: 18.87, lng: -98.81, name: 'Casa en Privada Valle' },
      isLatest: false,
    },
  ];

  const filteredTrips = useMemo(() => {
    if (!searchTerm) {
      return trips;
    }

    const lowerTerm = searchTerm.toLowerCase();
    return trips.filter((trip) => {
      return trip.address.toLowerCase().includes(lowerTerm) || trip.date.toLowerCase().includes(lowerTerm) || trip.price.toLowerCase().includes(lowerTerm);
    });
  }, [searchTerm, trips]);

  const mockTripDetails = {
    driver: {
      name: 'Ignacio Sánchez Ramírez',
      rating: 4.9,
      trips: 512,
    },
    origin: {
      name: 'Docencia 2 UTEZ Emiliano Zapata',
      coords: [18.8503, -99.2008],
    },
    destination: {
      name: 'Casa en Privada Valle de San Luis',
      coords: [18.8703, -99.2208],
    },
  };

  const handleCardClick = (trip) => {
    setSelectedTrip({ ...trip, ...mockTripDetails });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTrip(null);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // --- MODAL DETALLES ---
  const TripDetailsModal = () => (
    <Dialog header="Detalles del Viaje" visible={showModal} onHide={handleCloseModal} style={{ width: '90vw', maxWidth: '700px' }} draggable={false} resizable={false} className="border-0 shadow" headerClassName="border-0 pb-0 fw-bold" contentClassName="pt-4">
      {selectedTrip && (
        <div className="d-flex flex-column gap-4">
          {/* Mapa */}
          <div style={{ height: '200px', borderRadius: '12px', overflow: 'hidden' }}>
            <MapView
              center={selectedTrip.origin && selectedTrip.destination ? [(selectedTrip.origin.coords[0] + selectedTrip.destination.coords[0]) / 2, (selectedTrip.origin.coords[1] + selectedTrip.destination.coords[1]) / 2] : [18.8503, -99.2008]}
              zoom={13}
              height="100%"
              markers={[
                { position: selectedTrip.origin.coords, popup: 'Origen', color: '#089b8f' },
                { position: selectedTrip.destination.coords, popup: 'Destino', color: '#a8bf30' },
              ]}
            />
          </div>

          {/* Sección: Conductor */}
          <div>
            <h6 className="fw-bold mb-3 d-flex align-items-center text-secondary">
              <Icon path={mdiAccountOutline} size={0.9} className="me-2" /> Conductor
            </h6>
            <div className="d-flex align-items-center gap-3 ps-1">
              <Avatar icon="pi pi-user" size="large" shape="circle" className="bg-secondary bg-opacity-25 text-secondary" />
              <div>
                <h6 className="fw-normal mb-0 fs-5">{selectedTrip.driver.name}</h6>
                <div className="small text-muted">
                  <i className="pi pi-star-fill me-1 text-warning" style={{ fontSize: '0.8rem' }}></i>
                  <span className="text-dark fw-bold me-2">{selectedTrip.driver.rating}</span>• {selectedTrip.driver.trips} viajes completados
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
                  <span className="text-secondary me-2 fw-bold">Origen • {selectedTrip.date.split(' - ')[0]}</span>
                  <div className="text-dark mt-1">{selectedTrip.origin.name}</div>
                </div>
              </div>
            </div>

            {/* Card Destino */}
            <div className="card border mb-0 shadow-none bg-light" style={{ borderRadius: '8px' }}>
              <div className="card-body py-2 px-3">
                <div className="text-dark small mb-0">
                  <span className="text-secondary me-2 fw-bold">Destino • {selectedTrip.date.split(' - ')[0]}</span>
                  <div className="text-dark mt-1">{selectedTrip.destination.name}</div>
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
                    <span className="fw-bold text-success">{selectedTrip.price}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="d-flex justify-content-end gap-2 pt-2">
            <Button label="Cerrar" className="p-button-outlined fw-bold px-4" style={{ color: 'var(--color-secondary)', borderColor: 'var(--color-secondary)' }} onClick={handleCloseModal} />
            <Button
              label="Reagendar"
              icon={<Icon path={mdiRefresh} size={0.8} className="me-2" />}
              className="btn-lime px-4"
              onClick={() => {
                handleCloseModal();
                navigate('/p/home', {
                  state: {
                    action: 'reschedule',
                    origin: selectedTrip.origin.name,
                    destination: selectedTrip.destination.name,
                  },
                });
              }}
            />
          </div>
        </div>
      )}
    </Dialog>
  );

  const TripCard = ({ address, date, price, origin, destination, onClick }) => (
    <div className="card border shadow-sm mb-3 hoverable" style={{ borderRadius: '12px' }} onClick={onClick}>
      <div className="card-body p-3">
        <div className="row align-items-center">
          {/* Imagen del Mapa */}
          <div className="col-12 col-md-auto mb-3 mb-md-0">
            <MapThumbnail origin={origin} destination={destination} size={100} className="trip-card-map-thumbnail" />
          </div>

          {/* Información del Viaje */}
          <div className="col-12 col-md overflow-hidden">
            <h6 className="fw-bold mb-1 text-dark text-truncate">{address}</h6>
            <p className="text-muted small mb-1 text-truncate">{date}</p>
            <p className="fw-bold text-dark mb-0 text-truncate">{price}</p>
          </div>

          {/* Botón Ver detalles */}
          <div className="col-12 col-md-auto mt-3 mt-md-0 d-flex justify-content-center justify-content-md-end">
            <Button
              label="Ver detalles"
              outlined
              size="small"
              icon={<Icon path={mdiDotsHorizontal} size={0.7} className="me-1" />}
              className="w-100 w-md-auto"
              style={{ color: 'var(--color-secondary)', borderColor: 'var(--color-secondary)' }}
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-100 container pb-3 py-4">
      <TripDetailsModal />

      {/* Header y Buscador */}
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

      <div className="row justify-content-center py-3">
        <div className="col-12">
          {searchTerm ? (
            <>
              <h4 className="fw-bold mb-3 text-dark">Resultados de búsqueda</h4>
              {filteredTrips.length > 0 ? (
                filteredTrips.map((trip) => <TripCard key={trip.id} address={trip.address} date={trip.date} price={trip.price} origin={trip.origin} destination={trip.destination} onClick={() => handleCardClick(trip)} />)
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
            </>
          ) : (
            <>
              {/* SECCIÓN: Última actividad */}
              <h4 className="fw-bold mb-3 text-dark">Última actividad</h4>
              {filteredTrips
                .filter((t) => t.isLatest)
                .map((trip) => (
                  <TripCard key={trip.id} address={trip.address} date={trip.date} price={trip.price} origin={trip.origin} destination={trip.destination} onClick={() => handleCardClick(trip)} />
                ))}

              {/* SECCIÓN: Anteriores */}
              <h4 className="fw-bold mb-3 text-dark">Anteriores</h4>
              {filteredTrips
                .filter((t) => !t.isLatest)
                .map((trip) => (
                  <TripCard key={trip.id} address={trip.address} date={trip.date} price={trip.price} origin={trip.origin} destination={trip.destination} onClick={() => handleCardClick(trip)} />
                ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
