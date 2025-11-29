import React from 'react';
import PropTypes from 'prop-types';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom marker icons for origin (teal) and destination (lime)
const originIcon = L.divIcon({
    className: 'custom-marker-origin',
    html: `
        <svg width="24" height="32" viewBox="0 0 24 32" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 20 12 20s12-11 12-20c0-6.627-5.373-12-12-12z" 
                fill="#089b8f" 
                stroke="white" 
                stroke-width="2"/>
            <circle cx="12" cy="11" r="3" fill="white"/>
        </svg>
    `,
    iconSize: [24, 32],
    iconAnchor: [12, 32],
});

const destinationIcon = L.divIcon({
    className: 'custom-marker-destination',
    html: `
        <svg width="24" height="32" viewBox="0 0 24 32" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 20 12 20s12-11 12-20c0-6.627-5.373-12-12-12z" 
                fill="#a8bf30" 
                stroke="white" 
                stroke-width="2"/>
            <circle cx="12" cy="11" r="3" fill="white"/>
        </svg>
    `,
    iconSize: [24, 32],
    iconAnchor: [12, 32],
});

/**
 * MapThumbnail - Static Map Thumbnail Component
 * Displays a small, non-interactive map showing origin and destination
 * Perfect for trip cards and history items
 * 
 * Props:
 * - origin: { lat, lng, name } - Origin location
 * - destination: { lat, lng, name } - Destination location
 * - size: number - Size of the thumbnail (default: 80)
 * - className: string - Additional CSS classes
 * 
 * Ready for backend integration:
 * - Connect to real trip coordinates
 * - Add route line between origin and destination
 */
const MapThumbnail = ({ 
    origin = { lat: 18.8568, lng: -98.7993, name: 'Origen' },
    destination = { lat: 18.8700, lng: -98.8100, name: 'Destino' },
    size = 80,
    className = ''
}) => {
    // Calculate center point between origin and destination
    const centerLat = (origin.lat + destination.lat) / 2;
    const centerLng = (origin.lng + destination.lng) / 2;
    const center = [centerLat, centerLng];
    
    // Calculate appropriate zoom level based on distance
    const calculateZoom = () => {
        const latDiff = Math.abs(origin.lat - destination.lat);
        const lngDiff = Math.abs(origin.lng - destination.lng);
        const maxDiff = Math.max(latDiff, lngDiff);
        
        if (maxDiff > 0.1) return 11;
        if (maxDiff > 0.05) return 12;
        if (maxDiff > 0.02) return 13;
        return 14;
    };
    
    const zoom = calculateZoom();

    return (
        <div 
            className={`map-thumbnail-container ${className}`} 
            style={{ 
                height: `${size}px`, 
                width: `${size}px`, 
                borderRadius: '8px',
                overflow: 'hidden',
                border: '2px solid #e9ecef'
            }}
        >
            <MapContainer
                center={center}
                zoom={zoom}
                style={{ height: '100%', width: '100%' }}
                dragging={false}
                touchZoom={false}
                doubleClickZoom={false}
                scrollWheelZoom={false}
                boxZoom={false}
                keyboard={false}
                zoomControl={false}
                attributionControl={false}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {/* Origin marker (Teal) */}
                <Marker 
                    position={[origin.lat, origin.lng]}
                    icon={originIcon}
                />
                
                {/* Destination marker (Lime) */}
                <Marker 
                    position={[destination.lat, destination.lng]}
                    icon={destinationIcon}
                />
            </MapContainer>
        </div>
    );
};

MapThumbnail.propTypes = {
    origin: PropTypes.shape({
        lat: PropTypes.number.isRequired,
        lng: PropTypes.number.isRequired,
        name: PropTypes.string,
    }),
    destination: PropTypes.shape({
        lat: PropTypes.number.isRequired,
        lng: PropTypes.number.isRequired,
        name: PropTypes.string,
    }),
    size: PropTypes.number,
    className: PropTypes.string,
};

export default MapThumbnail;

