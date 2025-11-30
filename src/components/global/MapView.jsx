import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
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

// Custom circle icon for user location
const createCircleIcon = (color) => {
  return L.divIcon({
    className: 'custom-circle-marker',
    html: `
      <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="8" fill="${color}" stroke="white" stroke-width="2" />
        <circle cx="12" cy="12" r="12" fill="${color}" opacity="0.2" />
      </svg>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

// Component to update map center only when triggered manually or initially
const MapController = ({ center, zoom, onRecenter }) => {
  const map = useMap();

  // Update view when center or zoom changes
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);

  // Expose recenter function
  useEffect(() => {
    if (onRecenter) {
      onRecenter.current = () => {
        if (center) map.setView(center, map.getZoom());
      };
    }
  }, [map, center, onRecenter]);

  return null;
};

// Custom Control for Recentering
const RecenterControl = ({ onRecenter }) => {
  return (
    <div className="leaflet-top leaflet-left" style={{ marginTop: '80px' }}>
      <div className="leaflet-control leaflet-bar">
        <a
          href="#"
          className="leaflet-control-zoom-in"
          title="Centrar en mi ubicación"
          role="button"
          aria-label="Centrar en mi ubicación"
          onClick={(e) => {
            e.preventDefault();
            if (onRecenter && onRecenter.current) onRecenter.current();
          }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <circle cx="12" cy="12" r="3"></circle>
            <line x1="12" y1="2" x2="12" y2="6"></line>
            <line x1="12" y1="18" x2="12" y2="22"></line>
            <line x1="2" y1="12" x2="6" y2="12"></line>
            <line x1="18" y1="12" x2="22" y2="12"></line>
          </svg>
        </a>
      </div>
    </div>
  );
};

// Component to handle map clicks
const MapClickHandler = ({ onClick }) => {
  useMapEvents({
    click: (e) => {
      if (onClick) {
        onClick(e);
      }
    },
  });
  return null;
};

// Component to auto-open popup on mount
const AutoOpenPopup = ({ markerRef }) => {
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.openPopup();
    }
  }, [markerRef]);
  return null;
};

/**
 * MapView - Interactive Map Component
 * Displays an interactive Leaflet map with customizable markers.
 * Used by both Passenger and Driver views.
 *
 * Props:
 * - center: [lat, lng] - Center coordinates of the map
 * - zoom: number - Zoom level (default: 13)
 * - markers: Array of marker objects with { position: [lat, lng], popup, color }
 * - height: string - Height of the map container (default: '400px')
 * - className: string - Additional CSS classes
 * - onClick: function - Callback when map is clicked. Receives Leaflet event object.
 * - tempMarker: Object { position: [lat, lng], label: string, color: string } - Marker for active selection.
 * - onConfirmSelection: function - Callback when check button is clicked on temp marker.
 * - onCancelSelection: function - Callback when cancel button is clicked on temp marker.
 */
const MapView = React.forwardRef(({
  center = [18.8502428, -99.2014329], // Default: Emiliano Zapata, Morelos
  zoom = 15,
  markers = [],
  height = '600px',
  className = '',
  onClick = null,
  tempMarker = null,
  onConfirmSelection = null,
  onCancelSelection = null,
}, ref) => {
  const tempMarkerRef = React.useRef(null);
  const recenterMapRef = React.useRef(null);

  // Expose recenter function to parent
  React.useImperativeHandle(ref, () => ({
    recenter: () => {
      if (recenterMapRef.current) {
        recenterMapRef.current();
      }
    }
  }));

  return (
    <div className={`map-view-container ${className}`} style={{ height, width: '100%', position: 'relative' }}>
      <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%', borderRadius: '12px' }} scrollWheelZoom={false} zoomControl={true}>
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <MapController center={center} zoom={zoom} onRecenter={recenterMapRef} />
        <RecenterControl onRecenter={recenterMapRef} />

        {onClick && <MapClickHandler onClick={onClick} />}

        {/* Render custom markers */}
        {markers.map((marker, index) => {
          let icon;
          if (marker.type === 'circle') {
            icon = createCircleIcon(marker.color || '#0084c4');
          } else {
            icon = marker.color ? createCustomIcon(marker.color) : undefined;
          }

          return (
            <Marker key={index} position={marker.position} icon={icon}>
              {marker.popup && <Popup>{marker.popup}</Popup>}
            </Marker>
          );
        })}

        {/* Render Temporary Marker for Selection */}
        {tempMarker && (
          <>
            <Marker ref={tempMarkerRef} position={tempMarker.position} icon={createCustomIcon(tempMarker.color || '#000')}>
              <Popup>
                <div className="d-flex flex-column align-items-center gap-2 p-1">
                  <span className="fw-bold small">{tempMarker.label || 'Confirmar ubicación'}</span>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-danger d-flex align-items-center justify-content-center p-1"
                      style={{ width: '30px', height: '30px', borderRadius: '50%' }}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent map click
                        if (onCancelSelection) onCancelSelection();
                      }}
                      title="Cancelar"
                    >
                      <i className="pi pi-times" style={{ fontSize: '0.8rem' }}></i>
                    </button>
                    <button
                      className="btn btn-sm btn-success d-flex align-items-center justify-content-center p-1"
                      style={{ width: '30px', height: '30px', borderRadius: '50%' }}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent map click
                        if (onConfirmSelection) onConfirmSelection(tempMarker.position);
                      }}
                      title="Confirmar"
                    >
                      <i className="pi pi-check" style={{ fontSize: '0.8rem' }}></i>
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
            <AutoOpenPopup markerRef={tempMarkerRef} />
          </>
        )}
      </MapContainer>
    </div>
  );
});

MapView.propTypes = {
  center: PropTypes.arrayOf(PropTypes.number),
  zoom: PropTypes.number,
  markers: PropTypes.arrayOf(
    PropTypes.shape({
      position: PropTypes.arrayOf(PropTypes.number).isRequired,
      popup: PropTypes.string,
      color: PropTypes.string,
      type: PropTypes.string, // 'circle' or undefined (default pin)
    })
  ),
  height: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
  tempMarker: PropTypes.shape({
    position: PropTypes.arrayOf(PropTypes.number).isRequired,
    label: PropTypes.string,
    color: PropTypes.string,
  }),
  onConfirmSelection: PropTypes.func,
  onCancelSelection: PropTypes.func,
};

MapView.displayName = 'MapView';

export default MapView;
