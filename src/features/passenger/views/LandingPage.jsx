import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useWebSocket } from '../../../hooks/useWebSocket';
import * as TripService from '../../../api/trip/trip.service';
import * as RatingService from '../../../api/rating/rating.service';
import Icon from '@mdi/react';
import { mdiAccountQuestion, mdiWallet, mdiBell, mdiFlash, mdiHistory, mdiMessageText, mdiStar } from '@mdi/js';
import { Avatar } from 'primereact/avatar';
import { Toast } from 'primereact/toast';

import TripStatusCard from '../components/TripStatusCard';
import TripStatusMobile from '../components/TripStatusMobile';
import MapView from '../../../components/global/MapView';

const ToolButton = ({ icon, label, onClick }) => (
  <div className="col-4 mb-2">
    <button type="button" onClick={onClick} className="d-flex flex-column align-items-center justify-content-start p-0 border-0 shadow-none w-100 h-100 hoverable" style={{ background: 'transparent' }}>
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

const DEFAULT_CENTER = [18.8568, -98.7993]; // Emiliano Zapata

export default function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useRef(null);
  
  // WebSocket hook
  const { lastMessage } = useWebSocket();

  // Estado del viaje y datos
  const [tripState, setTripState] = useState('request'); // request, searching, pickup, ongoing, dropoff, finished
  const [currentTrip, setCurrentTrip] = useState(null);
  const [showTripCard, setShowTripCard] = useState(true);

  // Estados de formulario
  const [originValue, setOriginValue] = useState('');
  const [destinationValue, setDestinationValue] = useState('');
  const [originCoords, setOriginCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);

  // Estados de mapa
  const [selectionMode, setSelectionMode] = useState('none');
  const [tempMarker, setTempMarker] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(false);
  const [isLocating, setIsLocating] = useState(true);
  
  // Historial reciente
  const [lastCompletedTrip, setLastCompletedTrip] = useState(null);
  const [passengerRating, setPassengerRating] = useState(user?.rating || null);
  
  const mapRef = useRef(null);

  // Refs para romper ciclos de dependencia
  const tripStateRef = useRef(tripState);
  const currentTripRef = useRef(currentTrip);

  useEffect(() => {
    tripStateRef.current = tripState;
    currentTripRef.current = currentTrip;
  }, [tripState, currentTrip]);

  // Handle Reschedule Action from TripHistory
  useEffect(() => {
    if (location.state?.action === 'reschedule') {
      const { origin, destination } = location.state;

      if (origin && destination) {
        setOriginValue(origin.name);
        setOriginCoords([origin.lat, origin.lng]);

        setDestinationValue(destination.name);
        setDestinationCoords([destination.lat, destination.lng]);

        setShowTripCard(true);
        setSelectionMode('none');
        setTripState('request');

        // Clear state to prevent re-run
        window.history.replaceState({}, document.title);
      }
    }
  }, [location.state]);

  useEffect(() => {
    if (user?.rating) {
      setPassengerRating(user.rating);
    }
  }, [user]);

  // Cargar última actividad (viaje completado) y calificaciones
  const [recentTrips, setRecentTrips] = useState([]);

  useEffect(() => {
      const fetchDashboardData = async () => {
          if (!user) return;
          try {
              // 1. Last Activity (Fetch last 3 completed trips)
              const historyResponse = await TripService.getClientHistory(user.id);
              if (historyResponse && historyResponse.data && historyResponse.data.length > 0) {
                  const completed = historyResponse.data
                    .filter(t => t.status === 'COMPLETED')
                    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                    .slice(0, 3); // Get top 3
                  
                  setRecentTrips(completed);
                  
                  // Keep setting lastCompletedTrip for backward compatibility if needed elsewhere, 
                  // or just use the first one for the "main" recent activity if design requires one.
                  // The request asks to "show more trips", so we likely iterate over `recentTrips`.
                  if (completed.length > 0) {
                      setLastCompletedTrip(completed[0]);
                  }
              }

              // 2. User Rating
              const ratingsResponse = await RatingService.getClientRatings(user.id);
              console.log('Passenger Ratings Response:', ratingsResponse);
              if (ratingsResponse && ratingsResponse.data && ratingsResponse.data.average) {
                  const formatted = parseFloat(ratingsResponse.data.average).toFixed(1);
                  setPassengerRating(formatted);
              }
          } catch (error) {
              console.error("Error fetching dashboard data", error);
          }
      };
      
      fetchDashboardData();
  }, [user, tripState]);

  // Helper to format date safely
  const formatDate = (dateString) => {
      if (!dateString) return '';
      try {
          return new Date(dateString).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
      } catch (e) {
          return '';
      }
  };

  // --- Lógica de Ubicación ---
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
          
          // Si no hay origen seleccionado, establecer ubicación actual como origen por defecto (opcional)
          // if (!originCoords) {
          //   setOriginCoords(userPos);
          //   setOriginValue('Ubicación actual');
          // }
        },
        (error) => {
          console.warn('No se pudo obtener la ubicación.', error);
          setLocationError(true);
          setIsLocating(false);
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

  useEffect(() => {
    getLocation();
  }, []);

  // --- Lógica WebSocket ---
  useEffect(() => {
    if (!lastMessage) return;

    if (lastMessage.type === 'TRIP_UPDATE') {
      const tripUpdate = lastMessage.data;
      console.log('Trip update received:', tripUpdate);
      
      const currentTripId = currentTripRef.current?.id;
      // Solo procesar si es el viaje actual (o si no tenemos viaje y es una confirmación de nuevo viaje)
      if (currentTripId && tripUpdate.tripId !== currentTripId) return;

      // Handle Driver Arrival Notification
      const isDriverArrivedMsg = lastMessage.message === 'DRIVER_ARRIVED' || tripUpdate.message === 'DRIVER_ARRIVED';
      const isDropoffArrivedMsg = lastMessage.message === 'DROPOFF_ARRIVED' || tripUpdate.message === 'DROPOFF_ARRIVED';
      
      if (isDriverArrivedMsg) {
          toast.current?.show({ severity: 'info', summary: 'Conductor llegó', detail: 'Tu conductor ha llegado al punto de recogida.' });
          setTripState('arrived');
      }
      
      if (isDropoffArrivedMsg) {
          setTripState('dropoff');
          toast.current?.show({ severity: 'info', summary: 'Llegada a destino', detail: 'El conductor ha llegado al destino.' });
      }

      // Actualizar estado local basado en el estado del viaje
      if (tripUpdate.status === 'ACCEPTED') {
        const currentTripState = tripStateRef.current;
        // Only set to pickup if we are NOT currently in 'arrived' state AND this isn't an arrival message
        if (!isDriverArrivedMsg && currentTripState !== 'arrived' && currentTripState !== 'dropoff') {
            setTripState('pickup');
        }
        
        // If we received arrival message, force update to arrived (redundant but safe)
        if (isDriverArrivedMsg) {
             setTripState('arrived');
        }

        setCurrentTrip(prev => ({ ...prev, ...tripUpdate }));
        
        // Check waiting states for start
        if (tripUpdate.driverStarted && !tripUpdate.clientStarted) {
             toast.current?.show({ severity: 'info', summary: 'Conductor listo', detail: 'El conductor ha iniciado el viaje. Por favor confirma.' });
        } else if (!tripUpdate.driverStarted && tripUpdate.clientStarted) {
             toast.current?.show({ severity: 'info', summary: 'Esperando', detail: 'Esperando al conductor.' });
        }

      } else if (tripUpdate.status === 'IN_PROGRESS') {
        // Solo cambiar a ongoing si NO estamos ya en dropoff (para evitar revertir si llega un mensaje tardío)
        if (tripStateRef.current !== 'dropoff' && !isDropoffArrivedMsg) {
            setTripState('ongoing');
            if (tripStateRef.current !== 'ongoing') {
                toast.current?.show({ severity: 'success', summary: 'Viaje iniciado', detail: 'El viaje ha comenzado.' });
            }
        }
        setCurrentTrip(prev => ({ ...prev, ...tripUpdate }));
      } else if (tripUpdate.status === 'COMPLETED') {
        setTripState('finished'); 
        setCurrentTrip(prev => ({ ...prev, ...tripUpdate }));
        if (tripStateRef.current !== 'finished') {
            toast.current?.show({ severity: 'success', summary: 'Viaje finalizado', detail: 'Has llegado a tu destino.' });
        }
      } else if (tripUpdate.status === 'CANCELLED') {
        setTripState('request');
        setCurrentTrip(null);
        toast.current?.show({ severity: 'warn', summary: 'Viaje cancelado', detail: 'El viaje ha sido cancelado.' });
      }
      
      // Manejar lógica específica de confirmación de fin (driverCompleted, clientCompleted)
      // Si el conductor completó y NO estamos en finished (ni clientCompleted), pasar a dropoff
      if (tripUpdate.driverCompleted && !tripUpdate.clientCompleted && tripUpdate.status !== 'COMPLETED') {
         if (tripStateRef.current !== 'dropoff') {
             setTripState('dropoff'); 
             toast.current?.show({ severity: 'info', summary: 'Confirmar llegada', detail: 'El conductor ha marcado el viaje como finalizado. Por favor confirma.' });
         }
      }
    }
  }, [lastMessage]);

  // --- Acciones del Viaje ---

  const handleRequestTrip = async () => {
    if (!originCoords || !destinationCoords) return;

    setTripState('searching');
    
    try {
      // Limpiar la dirección visual para enviar solo el texto
      // Formato actual display: "Dirección (Lat, Lng)"
      const cleanAddress = (val) => val.split('(')[0].trim();

      const payload = {
        clientId: user.id,
        originAddress: cleanAddress(originValue),
        originLatitude: originCoords[0],
        originLongitude: originCoords[1],
        destinationAddress: cleanAddress(destinationValue),
        destinationLatitude: destinationCoords[0],
        destinationLongitude: destinationCoords[1]
      };

      const response = await TripService.requestTrip(payload);
      if (response && response.data) {
        setCurrentTrip(response.data);
        // El estado se queda en 'searching' hasta que llegue evento WS de ACCEPTED
      }
    } catch (error) {
      console.error('Error requesting trip:', error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo solicitar el viaje.' });
      setTripState('request');
    }
  };

  const handleCancelTrip = async () => {
    if (!currentTrip?.id) {
      setTripState('request');
      return;
    }

    try {
      await TripService.cancelTrip(currentTrip.id, user.id, 'Cancelado por usuario');
      setTripState('request');
      setCurrentTrip(null);
      toast.current?.show({ severity: 'info', summary: 'Cancelado', detail: 'Solicitud cancelada.' });
    } catch (error) {
      console.error('Error canceling trip:', error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al cancelar.' });
    }
  };

  const handleConfirmPickup = async () => {
    if (!currentTrip?.id) return;

    try {
      await TripService.startTripByClient(currentTrip.id, user.id);
      // Esperamos confirmación WS de IN_PROGRESS, pero podemos adelantar UI si es necesario o mostrar un loader
      toast.current?.show({ severity: 'success', summary: 'Confirmado', detail: 'Has confirmado el inicio. Esperando al conductor.' });
    } catch (error) {
      console.error('Error starting trip:', error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al confirmar inicio.' });
    }
  };

  const handleConfirmDropoff = async () => {
    if (!currentTrip?.id) return;

    try {
      await TripService.completeTripByClient(currentTrip.id, user.id);
      // Esperamos confirmación WS de COMPLETED, pero podemos adelantar UI
      // Si el conductor ya confirmó, pasará a COMPLETED. Si no, espera.
    } catch (error) {
      console.error('Error completing trip:', error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al confirmar finalización.' });
    }
  };

  const handleResetTrip = () => {
    setTripState('request');
    setOriginValue('');
    setDestinationValue('');
    setOriginCoords(null);
    setDestinationCoords(null);
    setCurrentTrip(null);
    setSelectionMode('none');
    setTempMarker(null);
  };

  const handleRateDriver = async (rating) => {
    if (!currentTrip) return;
    try {
      await RatingService.rateDriver(user.id, {
        tripId: currentTrip.id || currentTrip.tripId, // Check ID field name compatibility
        rating: rating,
        comment: ''
      });
      toast.current?.show({ severity: 'success', summary: 'Calificado', detail: 'Calificación enviada exitosamente.' });
      handleResetTrip();
    } catch (error) {
      console.error('Error rating driver:', error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo enviar la calificación.' });
    }
  };

  // --- Helpers Mapa ---
  const mockReverseGeocode = (lat, lng) => {
    const streets = ['Av. Universidad Tecnológica', 'Calle 5 de Mayo', 'Blvd. Emiliano Zapata', 'Calle Reforma', 'Av. Constitución', 'Privada de los Pinos', 'Camino Real', 'Calle Niños Héroes'];
    const streetIndex = Math.floor(Math.abs(lng * 10000) % streets.length);
    const number = Math.floor(Math.abs(lat * 100000) % 500) + 1;
    return `${streets[streetIndex]} #${number}, Emiliano Zapata`;
  };

  // Handlers selección mapa
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
      if (mapRef.current && mapRef.current.recenter) mapRef.current.recenter();
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
      if (!originCoords) {
        setTimeout(() => {
          setSelectionMode('origin');
          setTempMarker(null);
          if (mapRef.current && mapRef.current.recenter) mapRef.current.recenter();
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

  // Construir marcadores
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

  // Props comunes para las tarjetas
  const cardProps = {
    tripState,
    tripData: currentTrip,
    originValue,
    destinationValue,
    onSelectOriginLocation: handleSelectOriginLocation,
    onSelectDestinationLocation: handleSelectDestinationLocation,
    selectionMode,
    onResetTrip: handleResetTrip,
    onRequestTrip: handleRequestTrip,
    onCancelTrip: handleCancelTrip,
    onConfirmPickup: handleConfirmPickup,
    onConfirmDropoff: handleConfirmDropoff,
    isFormValid,
    onRate: handleRateDriver,
    onHide: () => setShowTripCard(false), // Solo para móvil a veces se usa ocultar
  };

  return (
    <div className="w-100 container pb-3">
      <Toast ref={toast} />
      
      {/* --- SECCIÓN DEL MAPA Y SOLICITUD --- */}
      <div className="row py-3 position-relative">
        <div className="col-12 d-lg-none">
          {showTripCard && <TripStatusMobile {...cardProps} />}
        </div>

        <div className="col-12">
          {locationError && (
            <div className="alert alert-warning border-0 shadow-sm d-flex align-items-center justify-content-between mb-3" role="alert">
              <div className="d-flex align-items-center gap-2">
                <i className="pi pi-exclamation-triangle text-warning" style={{ fontSize: '1.2rem' }}></i>
                <div>
                  <small className="fw-bold d-block">Ubicación no disponible</small>
                  <small>Es necesario que habilites tu ubicación actual.</small>
                </div>
              </div>
              <button className="btn btn-sm btn-outline-warning fw-bold text-dark" onClick={getLocation} disabled={isLocating}>
                {isLocating ? 'Buscando...' : 'Reintentar'}
              </button>
            </div>
          )}

          <div className="position-relative">
            <div className={`card shadow-sm overflow-hidden ${selectionMode !== 'none' ? 'border-2 border-primary' : ''}`}>
              <div
                className="map-container position-relative landing-map-height"
                onClick={() => {
                  if (selectionMode === 'none') setShowTripCard(true);
                }}
                style={{ cursor: selectionMode !== 'none' ? 'crosshair' : 'pointer' }}
              >
                <MapView 
                  ref={mapRef} 
                  center={userLocation || DEFAULT_CENTER} 
                  zoom={15} 
                  height="100%" 
                  markers={mapMarkers} 
                  onClick={handleMapClick} 
                  tempMarker={tempMarker} 
                  onConfirmSelection={handleConfirmSelection} 
                  onCancelSelection={handleCancelSelection} 
                />

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
                <TripStatusCard {...cardProps} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- SECCIÓN INFERIOR --- */}
      <div className="row g-3">
        <div className="col-12 col-lg-4">
          <div className="card shadow-sm h-100">
            <div className="card-body p-3">
              <h4 className="fw-bold mb-3">Herramientas</h4>
              <div className="row g-2">
                <ToolButton icon={mdiAccountQuestion} label="Ayuda" onClick={() => {}} />
                <ToolButton icon={mdiWallet} label="Billetera" onClick={() => navigate('/p/profile')} />
                <ToolButton icon={mdiBell} label="Notificaciones" onClick={() => navigate('/p/alerts')} />
                <ToolButton icon={mdiFlash} label="Promociones" onClick={() => {}} />
                <ToolButton icon={mdiHistory} label="Mis viajes" onClick={() => navigate('/p/trips')} />
                <ToolButton icon={mdiMessageText} label="Mensajes" onClick={() => navigate('/p/messages')} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card shadow-sm h-100">
            <div className="card-body p-3">
              <h4 className="fw-bold mb-3">Actividad reciente</h4>
              <div className="d-flex flex-column">
                {recentTrips.length > 0 ? (
                  recentTrips.map((trip) => (
                    <div 
                        key={trip.id}
                        className="d-flex align-items-center justify-content-between py-2 bg-light hoverable px-3 rounded-5 transition-all mb-2 cursor-pointer w-100"
                        onClick={() => navigate('/p/trips', { state: { openTripId: trip.id } })}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="d-flex align-items-center gap-3 overflow-hidden">
                            <div className="rounded-circle border d-flex align-items-center justify-content-center flex-shrink-0 bg-white" style={{ width: '35px', height: '35px' }}>
                                <Icon path={mdiHistory} size={0.8} className="text-dark" />
                            </div>
                            <div className="d-flex flex-column overflow-hidden w-100">
                                <p className="mb-0 text-truncate w-100">{trip.destinationAddress || trip.destination}</p>
                                <small className="text-muted">{formatDate(trip.updatedAt)}</small>
                            </div>
                        </div>
                        <div className="flex-shrink-0 ms-2">
                             <i className="pi pi-chevron-right text-secondary" style={{ fontSize: '0.9rem' }}></i>
                        </div>
                    </div>
                  ))
                ) : (
                    <p className="text-muted small mb-0 text-center">No hay actividad reciente.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card shadow-sm h-100">
            <div className="card-body p-3 d-flex flex-column align-items-center justify-content-center text-center">
              <h4 className="fw-bold w-100 text-start mb-3">Mi calificación</h4>
              <div className="d-flex align-items-center gap-2 mb-2">
                <Avatar image={user.avatar} icon={!user.avatar ? 'pi pi-user' : null} shape="circle" className="bg-warning text-white" style={{ width: '50px', height: '50px', flexShrink: 0 }} />
                <span className="fs-4 fw-normal">
                  {user?.name} {user?.paternalSurname} {user?.maternalSurname || '?'}
                </span>
              </div>
              <div className="d-flex align-items-center gap-2 mb-2">
                <Icon path={mdiStar} size={2.5} style={{ color: 'var(--color-teal-tint-1)' }} />
                {passengerRating && passengerRating !== '0.0' ? (
                  <span className="fw-bold" style={{ fontSize: '2.5rem', color: 'var(--color-teal-tint-1)' }}>
                    {passengerRating}
                  </span>
                ) : (
                  <span className="fw-bold text-muted" style={{ fontSize: '1.5rem' }}>
                    Sin calificaciones
                  </span>
                )}
              </div>
              <a href="#" className="text-muted text-decoration-none small mt-auto">Conoce el por qué de tu calificación</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}