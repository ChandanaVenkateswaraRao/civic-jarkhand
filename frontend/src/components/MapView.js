import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// This is a more robust way to handle the default marker icon.
const customMarkerIcon = new L.Icon({
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});


// This is a new helper component that will control the map's view.
const MapUpdater = ({ reports }) => {
  const map = useMap(); // This hook gives us access to the map instance.

  useEffect(() => {
    // This code runs every time the 'reports' array changes.
    
    const validReports = reports.filter(r => r.location && r.location.coordinates);

    if (validReports.length === 0) {
      // If there are no reports, fly to a default location (Ranchi).
      map.flyTo([23.3441, 85.3096], 12);
      return;
    }

    // Create a 'bounds' object that will encompass all marker locations.
    const bounds = L.latLngBounds(validReports.map(report => [
      report.location.coordinates[1], // latitude
      report.location.coordinates[0]  // longitude
    ]));

    // Tell the map to automatically pan and zoom to fit all the markers.
    // The padding adds a nice margin so markers aren't on the very edge.
    map.fitBounds(bounds, { padding: [50, 50] });

  }, [reports, map]); // The dependencies array ensures this runs when reports or the map instance changes.

  return null; // This component doesn't render any visible HTML.
};


const MapView = ({ reports }) => {
  // A default position for the initial render.
  const defaultPosition = [23.3441, 85.3096];

  return (
    <div className="map-container">
      <MapContainer center={defaultPosition} zoom={12} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* This part maps over the reports to create the markers. */}
        {reports && reports.map(report => (
          // Add a check to ensure location data is valid before creating a marker
          report.location && report.location.coordinates && (
            <Marker
              key={report._id}
              position={[report.location.coordinates[1], report.location.coordinates[0]]}
              icon={customMarkerIcon} // Use the robust custom icon
            >
              <Popup>
                <strong>{report.title}</strong><br />
                Category: {report.category}<br />
                Status: {report.status}
              </Popup>
            </Marker>
          )
        ))}
        
        {/* IMPORTANT: We include the MapUpdater as a child of the map. */}
        {/* It will now control the map's view dynamically. */}
        <MapUpdater reports={reports} />
      </MapContainer>
    </div>
  );
};

export default MapView;