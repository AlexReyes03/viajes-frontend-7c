import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with Webpack/Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

// Custom marker icons with different colors
const createCustomIcon = (color) => {
    return L.divIcon({
        className: 'custom-marker',
        html: `
            <svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 0C8.373 0 3 5.373 3 12c0 9 12 28 12 28s12-19 12-28c0-6.627-5.373-12-12-12z" 
                    fill="${color}" 
                    stroke="white" 
                    stroke-width="2"/>
                <circle cx="15" cy="12" r="4" fill="white"/>
            </svg>
        `,
        iconSize: [30, 40],
        iconAnchor: [15, 40],
        popupAnchor: [0, -40],
    });
};

// Component to update map center when props change
const MapUpdater = ({ center, zoom }) => {
    const map = useMap();
    
    useEffect(() => {
        if (center) {
            map.setView(center, zoom);
        }
    }, [center, zoom, map]);
    
    return null;
};

/**
 * MapView - Interactive Map Component
 * Displays an interactive Leaflet map with customizable markers
 * 
 * Props:
 * - center: [lat, lng] - Center coordinates of the map
 * - zoom: number - Zoom level (default: 13)
 * - markers: Array of marker objects with { position: [lat, lng], popup, color }
 * - height: string - Height of the map container (default: '400px')
 * - className: string - Additional CSS classes
 * - onClick: function - Callback when map is clicked
 * 
 * Ready for backend integration:
 * - Connect to real geolocation data
 * - Add route visualization between points
 * - Implement real-time driver location tracking
 */
const MapView = ({ 
    center = [18.8568, -98.7993], // Default: Emiliano Zapata, Morelos
    zoom = 13, 
    markers = [], 
    height = '400px',
    className = '',
    onClick = null
}) => {
    return (
        <div className={`map-view-container ${className}`} style={{ height, width: '100%', position: 'relative' }}>
            <MapContainer
                center={center}
                zoom={zoom}
                style={{ height: '100%', width: '100%', borderRadius: '12px' }}
                scrollWheelZoom={false}
                zoomControl={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                <MapUpdater center={center} zoom={zoom} />
                
                {/* Render custom markers */}
                {markers.map((marker, index) => {
                    const icon = marker.color ? createCustomIcon(marker.color) : undefined;
                    
                    return (
                        <Marker 
                            key={index} 
                            position={marker.position}
                            icon={icon}
                        >
                            {marker.popup && (
                                <Popup>{marker.popup}</Popup>
                            )}
                        </Marker>
                    );
                })}
            </MapContainer>
            
            {/* Attribution overlay */}
            <div 
                className="position-absolute bottom-0 end-0 m-3 bg-white px-2 py-1 rounded shadow-sm"
                style={{ zIndex: 1000, fontSize: '0.75rem' }}
            >
                <span className="text-muted">© OpenStreetMap</span>
            </div>
        </div>
    );
};

MapView.propTypes = {
    center: PropTypes.arrayOf(PropTypes.number),
    zoom: PropTypes.number,
    markers: PropTypes.arrayOf(
        PropTypes.shape({
            position: PropTypes.arrayOf(PropTypes.number).isRequired,
            popup: PropTypes.string,
            color: PropTypes.string,
        })
    ),
    height: PropTypes.string,
    className: PropTypes.string,
    onClick: PropTypes.func,
};

export default MapView;

