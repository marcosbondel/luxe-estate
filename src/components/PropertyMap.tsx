'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet icon in Next.js
const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

export default function PropertyMap({ lat, lng, popupText = "Property Location" }: { lat?: number, lng?: number, popupText?: string }) {
  useEffect(() => {
    // @ts-ignore
    delete L.Icon.Default.prototype._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: iconRetinaUrl,
      iconUrl: iconUrl,
      shadowUrl: shadowUrl,
    });
  }, []);

  const position: [number, number] = lat && lng ? [lat, lng] : [37.4419, -122.1430];

  return (
    <div className="relative w-full aspect-4/3 rounded-lg overflow-hidden bg-slate-100 z-0 h-full min-h-[192px]">
      <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{ height: "100%", width: "100%", minHeight: "192px" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {(lat && lng) && (
          <Marker position={position}>
            <Popup>{popupText}</Popup>
          </Marker>
        )}
        {(!lat || !lng) && (
          <Marker position={position} opacity={0.5}>
            <Popup>Default Location</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
