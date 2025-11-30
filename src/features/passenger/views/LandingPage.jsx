import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiAccountQuestion, mdiWallet, mdiBell, mdiFlash, mdiHistory, mdiMessageText, mdiHomeOutline, mdiStar } from '@mdi/js';
import { Avatar } from 'primereact/avatar';

import TripStatusCard from '../components/TripStatusCard';
import TripStatusMobile from '../components/TripStatusMobile';
import MapView from '../../../components/global/MapView';

const ToolButton = ({ icon, label }) => (
  <div className="col-4 mb-2">
    <button type="button" className="d-flex flex-column align-items-center justify-content-start p-0 border-0 shadow-none w-100 h-100 hoverable" style={{ background: 'transparent' }}>
      <div
        className="d-flex align-items-center justify-content-center mb-1"
        style={{
          backgroundColor: '#E7E0EB',
          width: '50px',
          height: '50px',
          borderRadius: '12px',
          color: '#000',
        }}
      >
        <Icon path={icon} size={1} />
      </div>
      <span className="small fw-semibold text-dark text-center text-truncate w-100" style={{ textTransform: 'none' }}>
        {label}
      </span>
    </button>
  </div>
);

const ActivityItem = ({ icon, address, rating }) => (
  <div className="d-flex align-items-center justify-content-between py-2 bg-light hoverable px-3 rounded-5 transition-all mb-2">
    <div className="d-flex align-items-center gap-3 overflow-hidden">
      <div className="rounded-circle border d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '35px', height: '35px' }}>
        <Icon path={icon} size={0.8} className="text-dark" />
      </div>
      <div className="d-flex flex-column overflow-hidden">
        <span className="fw-semibold small text-truncate w-100 d-block">{address}</span>
      </div>
    </div>
    <div className="d-flex align-items-center gap-1 flex-shrink-0 ms-2">
      <Icon path={mdiStar} size={0.6} className="text-dark" />
      <span className="small fw-bold">{rating}</span>
    </div>
  </div>
);

const DEFAULT_CENTER = [18.8568, -98.7993];

export default function LandingPage() {
  const [showTripCard, setShowTripCard] = useState(true);
  const location = useLocation();

  const [originValue, setOriginValue] = useState('');
  const [destinationValue, setDestinationValue] = useState('');
  const [originCoords, setOriginCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);

  const [selectionMode, setSelectionMode] = useState('none');
  const [tempMarker, setTempMarker] = useState(null);

  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(false);
  const [isLocating, setIsLocating] = useState(true);
  const mapRef = React.useRef(null);

  const getLocation = () => {
    setIsLocating(true);
    setLocationError(false);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = [position.coords.latitude, position.coords.longitude];
          setUserLocation(userPos);
          setLocationError(false);
          setIsLocating(false);
        },
        (error) => {
          console.warn('No se pudo obtener la ubicación.', error);
          setLocationError(true);
          setIsLocating(false);
          // Mantener default center pero marcar error
          if (!userLocation) setUserLocation(DEFAULT_CENTER);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );
    } else {
      setLocationError(true);
      setIsLocating(false);
      if (!userLocation) setUserLocation(DEFAULT_CENTER);
    }
  };

  React.useEffect(() => {
    getLocation();
  }, []);

  // Simulación de Geocoding Inverso (Coordenadas -> Dirección)
  const mockReverseGeocode = (lat, lng) => {
    const streets = ['Av. Universidad Tecnológica', 'Calle 5 de Mayo', 'Blvd. Emiliano Zapata', 'Calle Reforma', 'Av. Constitución', 'Privada de los Pinos', 'Camino Real', 'Calle Niños Héroes'];
    const streetIndex = Math.floor(Math.abs(lng * 10000) % streets.length);
    const number = Math.floor(Math.abs(lat * 100000) % 500) + 1;
    return `${streets[streetIndex]} #${number}, Emiliano Zapata`;
  };

  // Handlers para cambios en inputs
  const handleOriginChange = (val) => {
    setOriginValue(val);
    if (!val) setOriginCoords(null);
  };

  const handleDestinationChange = (val) => {
    setDestinationValue(val);
    if (!val) setDestinationCoords(null);
  };

  // Manejadores para activar el modo de selección
  const handleSelectOriginLocation = () => {
    if (originCoords) {
      setOriginCoords(null);
      setOriginValue('');
      setSelectionMode('none');
    } else if (selectionMode === 'origin') {
      setSelectionMode('none');
      setTempMarker(null);
    } else {
      setSelectionMode('origin');
      setTempMarker(null);
      // Zoom a la ubicación del usuario al seleccionar origen
      if (mapRef.current && mapRef.current.recenter) {
        mapRef.current.recenter();
      }
    }
  };

  const handleSelectDestinationLocation = () => {
    if (destinationCoords) {
      setDestinationCoords(null);
      setDestinationValue('');
      setSelectionMode('none');
    } else if (selectionMode === 'destination') {
      setSelectionMode('none');
      setTempMarker(null);
    } else {
      setSelectionMode('destination');
      setTempMarker(null);
    }
  };

  const handleResetTrip = () => {
    setOriginValue('');
    setDestinationValue('');
    setOriginCoords(null);
    setDestinationCoords(null);
    setSelectionMode('none');
    setTempMarker(null);
  };

  // Manejador de clics en el mapa
  const handleMapClick = (e) => {
    if (selectionMode === 'none') return;

    const { lat, lng } = e.latlng;
    setTempMarker({
      position: [lat, lng],
      label: selectionMode === 'origin' ? '¿Confirmar Origen?' : '¿Confirmar Destino?',
      color: selectionMode === 'origin' ? '#089b8f' : '#a8bf30',
    });
  };

  const handleConfirmSelection = (position) => {
    const coordString = `${position[0].toFixed(7)}, ${position[1].toFixed(7)}`;
    const address = mockReverseGeocode(position[0], position[1]);

    const displayValue = `${address} (${coordString})`;

    if (selectionMode === 'origin') {
      setOriginCoords(position);
      setOriginValue(displayValue);
      setSelectionMode('none');
    } else if (selectionMode === 'destination') {
      setDestinationCoords(position);
      setDestinationValue(displayValue);

      // Si no hay origen definido, pasar automáticamente a seleccionar origen
      if (!originCoords) {
        setTimeout(() => {
          setSelectionMode('origin');
          setTempMarker(null);
          // Zoom a la ubicación del usuario
          if (mapRef.current && mapRef.current.recenter) {
            mapRef.current.recenter();
          }
        }, 100);
        return;
      } else {
        setSelectionMode('none');
      }
    }

    setTempMarker(null);
    setShowTripCard(true);
  };

  const handleCancelSelection = () => {
    setTempMarker(null);
  };

  const isFormValid = originCoords !== null && destinationCoords !== null;

  // Construir lista de marcadores para el mapa
  const mapMarkers = [];

  if (userLocation && !locationError) {
    mapMarkers.push({ position: userLocation, popup: 'Tu ubicación actual', color: '#0084c4', type: 'circle' });
  }

  if (originCoords) {
    mapMarkers.push({ position: originCoords, popup: 'Origen', color: '#089b8f' });
  }

  if (destinationCoords) {
    mapMarkers.push({ position: destinationCoords, popup: 'Destino', color: '#a8bf30' });
  }

  return (
    <div className="w-100 container pb-3">
      {/* --- SECCIÓN DEL MAPA Y SOLICITUD --- */}
      <div className="row py-3 position-relative">
        <div className="col-12 d-lg-none">
          {showTripCard && (
            <TripStatusMobile
              initialData={location.state}
              onHide={() => setShowTripCard(false)}
              originValue={originValue}
              destinationValue={destinationValue}
              onOriginChange={handleOriginChange}
              onDestinationChange={handleDestinationChange}
              onSelectOriginLocation={handleSelectOriginLocation}
              onSelectDestinationLocation={handleSelectDestinationLocation}
              selectionMode={selectionMode}
              onResetTrip={handleResetTrip}
              isFormValid={isFormValid}
            />
          )}
        </div>

        <div className="col-12">
          {locationError && (
            <div className="alert alert-warning border-0 shadow-sm d-flex align-items-center justify-content-between mb-3" role="alert">
              <div className="d-flex align-items-center gap-2">
                <i className="pi pi-exclamation-triangle text-warning" style={{ fontSize: '1.2rem' }}></i>
                <div>
                  <small className="fw-bold d-block">Ubicación no disponible</small>
                  <small>Es necesario que habilites tu ubicación actual para usar la aplicación correctamente.</small>
                </div>
              </div>
              <button className="btn btn-sm btn-outline-warning fw-bold text-dark" onClick={getLocation} disabled={isLocating}>
                {isLocating ? 'Buscando...' : 'Reintentar'}
              </button>
            </div>
          )}

          {/* Contenedor Relativo para Mapa y Tarjeta Flotante */}
          <div className="position-relative">
            <div className={`card shadow-sm overflow-hidden ${selectionMode !== 'none' ? 'border-2 border-primary' : ''}`}>
              <div
                className="map-container position-relative landing-map-height"
                onClick={() => {
                  if (selectionMode === 'none') setShowTripCard(true);
                }}
                style={{ cursor: selectionMode !== 'none' ? 'crosshair' : 'pointer' }}
              >
                <MapView ref={mapRef} center={userLocation || DEFAULT_CENTER} zoom={15} height="100%" markers={mapMarkers} onClick={handleMapClick} tempMarker={tempMarker} onConfirmSelection={handleConfirmSelection} onCancelSelection={handleCancelSelection} />

                {/* Mensaje de ayuda flotante durante la selección */}
                {selectionMode !== 'none' && !tempMarker && (
                  <div 
                    className="position-absolute top-0 start-50 translate-middle-x mt-3 bg-dark text-white px-3 py-2 rounded-pill shadow-sm text-center" 
                    style={{ zIndex: 1000, opacity: 0.9, maxWidth: '90%', width: 'max-content' }}
                  >
                    <small className="fw-bold d-block text-truncate" style={{ whiteSpace: 'normal' }}>
                      {selectionMode === 'origin' ? 'Toca en el mapa para definir el Origen' : 'Toca en el mapa para definir el Destino'}
                    </small>
                  </div>
                )}
              </div>
            </div>

            {showTripCard && (
              <div className="position-absolute end-0 top-0 pe-4 pt-4 d-none d-lg-block" style={{ zIndex: 1015, width: 'auto' }} onClick={(e) => e.stopPropagation()}>
                <TripStatusCard
                  onHide={() => setShowTripCard(false)}
                  initialData={location.state}
                  originValue={originValue}
                  destinationValue={destinationValue}
                  onOriginChange={handleOriginChange}
                  onDestinationChange={handleDestinationChange}
                  onSelectOriginLocation={handleSelectOriginLocation}
                  onSelectDestinationLocation={handleSelectDestinationLocation}
                  selectionMode={selectionMode}
                  onResetTrip={handleResetTrip}
                  isFormValid={isFormValid}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- SECCIÓN INFERIOR --- */}
      <div className="row g-3">
        {/* TARJETA 1: Herramientas */}
        <div className="col-12 col-lg-4">
          <div className="card shadow-sm h-100">
            <div className="card-body p-3">
              <h4 className="fw-bold mb-3">Herramientas</h4>
              <div className="row g-2">
                <ToolButton icon={mdiAccountQuestion} label="Ayuda" />
                <ToolButton icon={mdiWallet} label="Billetera" />
                <ToolButton icon={mdiBell} label="Notificaciones" />
                <ToolButton icon={mdiFlash} label="App Plus" />
                <ToolButton icon={mdiHistory} label="Mis viajes" />
                <ToolButton icon={mdiMessageText} label="Mensajes" />
              </div>
            </div>
          </div>
        </div>

        {/* TARJETA 2: Actividad Reciente */}
        <div className="col-12 col-lg-4">
          <div className="card shadow-sm h-100">
            <div className="card-body p-3">
              <h4 className="fw-bold mb-3">Actividad reciente</h4>

              <div className="d-flex flex-column">
                <ActivityItem icon={mdiHomeOutline} address="Casa en Privada Valle de San..." rating="5.0" />
                <ActivityItem icon={mdiHistory} address="Tractor Verde, 53, Colonia Azt..." rating="4.5" />
                <ActivityItem icon={mdiHistory} address="Av. Universidad Tecnológica, Emiliano Zapata" rating="4.5" />
              </div>
            </div>
          </div>
        </div>

        {/* TARJETA 3: Mi Calificación */}
        <div className="col-12 col-lg-4">
          <div className="card shadow-sm h-100">
            <div className="card-body p-3 d-flex flex-column align-items-center justify-content-center text-center">
              <h4 className="fw-bold w-100 text-start mb-3">Mi calificación</h4>

              <div className="d-flex align-items-center gap-2 mb-2">
                <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/xuxuefeng.png" size="large" shape="circle" className="p-overlay-badge" style={{ width: '50px', height: '50px' }} />
                <span className="fs-4 fw-normal">Alejandro Reyes</span>
              </div>

              <div className="d-flex align-items-center gap-2 mb-2">
                <Icon path={mdiStar} size={2.5} style={{ color: 'var(--color-teal-tint-1)' }} />
                <span className="fw-bold" style={{ fontSize: '2.5rem', color: 'var(--color-teal-tint-1)' }}>
                  4.5
                </span>
              </div>

              <a href="#" className="text-muted text-decoration-none small mt-auto">
                Conoce el por qué de tu calificación
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
