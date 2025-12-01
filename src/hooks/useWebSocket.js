import { useEffect, useState, useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from '../contexts/AuthContext';

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL 
  ? `${import.meta.env.VITE_BACKEND_URL}/ws` 
  : 'http://localhost:8080/ws';

export function useWebSocket() {
  const { token, user } = useAuth();
  const [client, setClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const [notifications, setNotifications] = useState([]);
  
  const connect = useCallback(() => {
    if (!token || client) return;

    const socket = new SockJS(`${SOCKET_URL}?token=${token}`);
    
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: () => {
        // console.log(str); // Uncomment for debugging
      },
    });

    stompClient.onConnect = () => {
      console.log('WebSocket Connected');
      setIsConnected(true);

      // Suscripción a notificaciones personales
      stompClient.subscribe('/user/queue/notifications', (message) => {
        const notification = JSON.parse(message.body);
        setNotifications((prev) => [notification, ...prev]);
        setLastMessage({ type: 'NOTIFICATION', data: notification });
      });

      // Suscripción a actualizaciones de viaje personales
      stompClient.subscribe('/user/queue/trips', (message) => {
        const tripUpdate = JSON.parse(message.body);
        setLastMessage({ type: 'TRIP_UPDATE', data: tripUpdate });
      });

      // Si es conductor, suscribirse a nuevos viajes
      if (user?.roles?.includes('ROLE_CONDUCTOR')) {
        stompClient.subscribe('/topic/trips/new', (message) => {
          const newTrip = JSON.parse(message.body);
          setLastMessage({ type: 'NEW_TRIP_REQUEST', data: newTrip });
        });
      }
    };

    stompClient.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    stompClient.activate();
    setClient(stompClient);
  }, [token, user, client]);

  const disconnect = useCallback(() => {
    if (client) {
      client.deactivate();
      setClient(null);
      setIsConnected(false);
      console.log('WebSocket Disconnected');
    }
  }, [client]);

  useEffect(() => {
    if (token) {
      connect();
    }
    return () => {
      disconnect();
    };
  }, [token]); // Dependencias reducidas para evitar reconexiones innecesarias

  return { client, isConnected, lastMessage, notifications };
}
