import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useWebSocket } from '../../../hooks/useWebSocket';
import * as TripService from '../../../api/trip/trip.service';
import * as RatingService from '../../../api/rating/rating.service';
import Icon from '@mdi/react';
import { mdiAccountQuestion, mdiWallet, mdiBell, mdiFlash, mdiHistory, mdiMessageText, mdiAccount, mdiStar } from '@mdi/js';
import { Avatar } from 'primereact/avatar';
import { Toast } from 'primereact/toast';

import TripStatusCard from '../components/TripStatusCard';
import TripStatusMobile from '../components/TripStatusMobile';
import MapView from '../../../components/global/MapView';

const ToolButton = ({ icon, label, onClick }) => (
  <div className="col-4 mb-2">
    <button type="button" className="d-flex flex-column align-items-center justify-content-start p-0 border-0 shadow-none w-100 h-100 hoverable" style={{ background: 'transparent' }} onClick={onClick}>
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

const RatingItem = ({ passengerName, rating, onClick }) => (
  <div 
    className="d-flex align-items-center justify-content-between py-2 bg-light hoverable px-3 rounded-5 transition-all mb-2 cursor-pointer"
    onClick={onClick}
    style={{ cursor: 'pointer' }}
  >
    <div className="d-flex align-items-center gap-3 overflow-hidden">
      <div className="rounded-circle border d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '35px', height: '35px' }}>
        <Icon path={mdiAccount} size={0.8} className="text-dark" />
      </div>
      <div className="d-flex flex-column overflow-hidden">
        <span className="fw-semibold small text-truncate w-100 d-block">{passengerName}</span>
      </div>
    </div>
    <div className="d-flex align-items-center gap-1 flex-shrink-0 ms-2">
      <Icon path={mdiStar} size={0.6} className="text-dark" />
      <span className="small fw-bold">{rating.toFixed(1)}</span>
    </div>
  </div>
);

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useRef(null);
  
  // WebSocket Hook
  const { lastMessage } = useWebSocket();

  // Estados
  const [tripState, setTripState] = useState('idle'); // idle, request, pickup, ongoing, dropoff, finished
  const [currentTrip, setCurrentTrip] = useState(null); // Datos del viaje actual o solicitud
  const [showTripCard, setShowTripCard] = useState(false);
  const [driverLocation, setDriverLocation] = useState([18.8568, -98.7993]); // Mock inicial
  const [recentRatings, setRecentRatings] = useState([]);
  const [driverRating, setDriverRating] = useState(user?.rating || null);

  // Refs para romper ciclos de dependencia en useEffect
  const currentTripRef = useRef(currentTrip);
  const tripStateRef = useRef(tripState);

  useEffect(() => {
    currentTripRef.current = currentTrip;
    tripStateRef.current = tripState;
  }, [currentTrip, tripState]);

  useEffect(() => {
    if (user?.rating) {
      setDriverRating(user.rating);
    }
  }, [user]);

  // Obtener historial y calificaciones
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const profileId = user.driverProfileId || user.id; 
        // Fetch ratings specifically
        const ratingsResponse = await RatingService.getDriverRatings(profileId);
        console.log('Driver Ratings Response:', ratingsResponse);
        
        if (ratingsResponse && ratingsResponse.data) {
          const { average, ratings } = ratingsResponse.data;
          
          if (average) {
             const formattedRating = parseFloat(average).toFixed(1);
             setDriverRating(formattedRating);
             // Optional: update user object if needed for other components, though context refresh is better
             user.rating = formattedRating; 
          }

          if (ratings && ratings.length > 0) {
             // Sort by createdAt desc
             const sortedRatings = ratings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
             
             // Map to UI format
             const uiRatings = sortedRatings.slice(0, 3).map(r => ({
                 id: r.id,
                 tripId: r.tripId,
                 passengerName: r.raterName || 'Pasajero',
                 rating: r.rating
             }));
             setRecentRatings(uiRatings);
          } else {
             setRecentRatings([]);
          }
        }
      } catch (error) {
        console.error('Error fetching history:', error);
      }
    };

    if (user) {
      fetchHistory();
    }
  }, [user]);

  // Obtener ubicación del conductor
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          setDriverLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => console.warn('Error obteniendo ubicación', error),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  // Manejo de mensajes WebSocket
  useEffect(() => {
    if (!lastMessage) return;

    // Nueva solicitud de viaje
    if (lastMessage.type === 'NEW_TRIP_REQUEST') {
      const newTrip = lastMessage.data;
      // Solo mostrar si el conductor está libre
      if (tripStateRef.current === 'idle' || tripStateRef.current === 'finished') {
        console.log('Nueva solicitud recibida:', newTrip);
        setCurrentTrip(newTrip);
        setTripState('request');
        setShowTripCard(true);
        toast.current?.show({ severity: 'info', summary: 'Nueva solicitud', detail: 'Tienes una nueva solicitud de viaje.' });
        
        // Play notification sound (opcional)
        // new Audio('/notification.mp3').play().catch(e => console.log('Audio play failed', e));
      }
    }

    // Actualización de viaje propio
    if (lastMessage.type === 'TRIP_UPDATE') {
      const tripUpdate = lastMessage.data;
      const currentT = currentTripRef.current;

      // Verificar si es el viaje que estamos atendiendo
      if (currentT && tripUpdate.tripId === currentT.tripId) {
        console.log('Actualización de viaje:', tripUpdate);
        setCurrentTrip(prev => ({ ...prev, ...tripUpdate }));

        const msgType = lastMessage.message || tripUpdate.message;

        if (msgType === 'DROPOFF_ARRIVED') {
             setTripState('dropoff');
             toast.current?.show({ severity: 'info', summary: 'Llegada notificada', detail: 'Has notificado la llegada al destino.' });
        } else if (tripUpdate.status === 'CANCELLED') {
          setTripState('idle');
          setShowTripCard(false);
          setCurrentTrip(null);
          toast.current?.show({ severity: 'warn', summary: 'Viaje cancelado', detail: 'El cliente canceló el viaje.' });
        } else if (tripUpdate.status === 'IN_PROGRESS') {
          // Solo cambiar a ongoing si NO estamos ya en dropoff
          if (tripStateRef.current !== 'dropoff') {
              setTripState('ongoing');
              if (tripStateRef.current !== 'ongoing') {
                 toast.current?.show({ severity: 'success', summary: 'Viaje iniciado', detail: 'El viaje está en curso.' });
              }
          }
        } else if (tripUpdate.status === 'COMPLETED') {
          setTripState('finished');
          // No cerramos la tarjeta automáticamente, dejamos que el conductor la cierre
        } else if (tripUpdate.clientCompleted && !tripUpdate.driverCompleted) {
           toast.current?.show({ severity: 'info', summary: 'Cliente finalizó', detail: 'El cliente ha confirmado el fin del viaje.' });
        } else if (tripUpdate.clientStarted && !tripUpdate.driverStarted) {
           toast.current?.show({ severity: 'info', summary: 'Cliente listo', detail: 'El cliente ha confirmado el inicio.' });
        }
      }
    }
  }, [lastMessage]);

  // --- Acciones del Conductor ---

  const handleAcceptTrip = async () => {
    if (!currentTrip) return;
    
    try {
      // Use user.id directly, backend will handle profile resolution/creation
      await TripService.acceptTrip(currentTrip.tripId, user.id);
      setTripState('pickup');
      toast.current?.show({ severity: 'success', summary: 'Aceptado', detail: 'Viaje aceptado. Dirígete al origen.' });
    } catch (error) {
      console.error('Error accepting trip:', error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo aceptar el viaje (quizás ya fue tomado).' });
      setTripState('idle');
      setShowTripCard(false);
      setCurrentTrip(null);
    }
  };

  const handleRejectTrip = async () => {
    if (!currentTrip) return;
    
    try {
      setTripState('idle');
      setShowTripCard(false);
      setCurrentTrip(null);
    } catch (error) {
      console.error('Error rejecting trip:', error);
    }
  };

  const handleNotifyArrival = async () => {
    if (!currentTrip) return;
    
    try {
      await TripService.notifyArrival(currentTrip.tripId, user.id);
      setTripState('arrived');
      toast.current?.show({ severity: 'info', summary: 'Notificado', detail: 'Has notificado tu llegada al pasajero.' });
    } catch (error) {
      console.error('Error notifying arrival:', error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo notificar la llegada.' });
    }
  };

  const handleStartTrip = async () => {
    if (!currentTrip) return;

    try {
        // Use specific start endpoint
        await TripService.startTripByDriver(currentTrip.tripId, user.id);
        // Note: State update to 'ongoing' will happen via WebSocket update when both confirm
        // But for immediate feedback if waiting, we might want to show 'waiting' state
        toast.current?.show({ severity: 'success', summary: 'Iniciado', detail: 'Has confirmado el inicio. Esperando al pasajero.' });
    } catch (error) {
        console.error('Error starting trip:', error);
        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo iniciar el viaje.' });
    }
  };

  const handleArriveDropoff = async () => {
      if (!currentTrip) return;
      try {
          await TripService.notifyDropoff(currentTrip.tripId, user.id);
          setTripState('dropoff'); // Optimistic update
      } catch (error) {
          console.error('Error notifying dropoff:', error);
          toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo notificar la llegada al destino.' });
      }
  };

  const handleCompleteTrip = async () => {
    if (!currentTrip) return;

    try {
        // Use user.id, backend handles profile resolution
        await TripService.completeTripByDriver(currentTrip.tripId, user.id);
    } catch (error) {
        console.error('Error completing trip:', error);
        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo finalizar el viaje.' });
    }
  };

  const handleCloseFinished = () => {
      setTripState('idle');
      setShowTripCard(false);
      setCurrentTrip(null);
  };

  const handleRatePassenger = async (rating) => {
    if (!currentTrip) return;
    try {
      // Driver profile ID is usually user.driverProfileId or derived from user.id
      const driverId = user.driverProfileId || user.id; 
      await RatingService.rateClient(driverId, {
        tripId: currentTrip.tripId,
        rating: rating,
        comment: '' // Optional comment
      });
      toast.current?.show({ severity: 'success', summary: 'Calificado', detail: 'Calificación enviada exitosamente.' });
      handleCloseFinished();
    } catch (error) {
      console.error('Error rating passenger:', error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo enviar la calificación.' });
      // Still close on error? Maybe let them retry.
    }
  };

  // Props para las tarjetas
  const cardProps = {
      tripState,
      tripData: currentTrip,
      onAccept: handleAcceptTrip,
      onReject: handleRejectTrip,
      onNotifyArrival: handleNotifyArrival,
      onStartTrip: handleStartTrip,
      onArriveDropoff: handleArriveDropoff,
      onCompleteTrip: handleCompleteTrip,
      onClose: handleCloseFinished,
      onRate: handleRatePassenger,
      onHide: () => setShowTripCard(false)
  };

  // Marcadores para el mapa
  const mapMarkers = [
      { position: driverLocation, popup: 'Tu ubicación', color: '#a8bf30', type: 'circle' }
  ];
  
  // Agregar origen/destino si hay viaje activo
  if (currentTrip && tripState !== 'idle' && tripState !== 'finished') {
      // Asumimos que currentTrip tiene origin/destination como strings o coords si el backend lo mandara
      // En el JSON de ejemplo del backend: origin="Location A". 
      // Para el mapa necesitamos coordenadas. 
      // Mock coordenadas para demo si no vienen:
      const mockOrigin = [18.8503, -99.2008];
      const mockDest = [18.8703, -99.2208];
      
      mapMarkers.push({ position: mockOrigin, popup: 'Recogida', color: '#089b8f' });
      mapMarkers.push({ position: mockDest, popup: 'Destino', color: '#d35050' });
  }

  return (
    <div className="w-100 container pb-3">
      <Toast ref={toast} />

      {/* --- MAP AND TRIP REQUEST SECTION --- */}
      <div className="row py-3 position-relative">
        <div className="col-12 d-lg-none">
            {showTripCard && <TripStatusMobile {...cardProps} />}
        </div>

        {/* DESKTOP VIEW: Floating component */}
        {showTripCard && (
          <div className="position-absolute end-0 top-0 pe-3 pt-4 d-none d-lg-block" style={{ zIndex: 1010, width: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <TripStatusCard {...cardProps} />
          </div>
        )}

        <div className="col-12">
          <div className="card shadow-sm overflow-hidden">
            <div className="map-container position-relative landing-map-height" style={{ cursor: 'default' }}>
              <MapView
                center={driverLocation}
                zoom={13}
                height="100%"
                markers={mapMarkers}
              />
            </div>
          </div>
        </div>
      </div>

      {/* --- BOTTOM SECTION (3 COLUMNS) --- */}
      <div className="row g-3">
        {/* CARD 1: Tools */}
        <div className="col-12 col-lg-4">
          <div className="card shadow-sm h-100">
            <div className="card-body p-3">
              <h4 className="fw-bold mb-3">Herramientas</h4>
              <div className="row g-2">
                <ToolButton icon={mdiAccountQuestion} label="Ayuda" onClick={() => {}} />
                <ToolButton icon={mdiWallet} label="Billetera" onClick={() => navigate('/d/profile')} />
                <ToolButton icon={mdiBell} label="Notificaciones" onClick={() => navigate('/d/alerts')} />
                <ToolButton icon={mdiFlash} label="Promociones" onClick={() => {}} />
                <ToolButton icon={mdiHistory} label="Mis viajes" onClick={() => navigate('/d/trips')} />
                <ToolButton icon={mdiMessageText} label="Mensajes" onClick={() => navigate('/d/messages')} />
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2: Recent Ratings */}
        <div className="col-12 col-lg-4">
          <div className="card shadow-sm h-100">
            <div className="card-body p-3">
              <h4 className="fw-bold mb-3">Calificaciones Recientes</h4>

              <div className="d-flex flex-column">
                {recentRatings.length > 0 ? (
                  recentRatings.map((rating) => (
                    <RatingItem 
                        key={rating.id} 
                        passengerName={rating.passengerName} 
                        rating={rating.rating} 
                        onClick={() => navigate('/d/trips', { state: { openTripId: rating.tripId } })}
                    />
                  ))
                ) : (
                  <div className="text-center text-muted py-4">
                    <p className="mb-0">No hay calificaciones recientes</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CARD 3: My Rating */}
        <div className="col-12 col-lg-4">
          <div className="card shadow-sm h-100">
            <div className="card-body p-3 d-flex flex-column align-items-center justify-content-center text-center">
              <h4 className="fw-bold w-100 text-start mb-3">Mi calificación</h4>

              <div className="d-flex align-items-center gap-2 mb-2">
                <Avatar image={user.avatar} icon={!user.avatar ? 'pi pi-user' : null} shape="circle" className="bg-warning text-white" style={{ width: '50px', height: '50px', flexShrink: 0 }} />
                <span className="fs-4 fw-normal">
                  {user?.name} {user?.paternalSurname} {user?.maternalSurname || ''}
                </span>
              </div>

              <span className="text-muted small mb-3">Conductor</span>

              <div className="d-flex align-items-center gap-2 mb-2">
                <Icon path={mdiStar} size={2.5} style={{ color: 'var(--color-teal-tint-1)' }} />
                {driverRating && driverRating !== '0.0' ? (
                  <span className="fw-bold" style={{ fontSize: '2.5rem', color: 'var(--color-teal-tint-1)' }}>
                    {driverRating}
                  </span>
                ) : (
                  <span className="fw-bold" style={{ fontSize: '2.5rem', color: 'var(--color-teal-tint-1)' }}>
                    5.0
                  </span>
                )}
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
